import React, { useEffect, useState } from "react";
import "./admin.css";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/leaves/");
      const data = await res.json();
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  const updateLeaveStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/leaves/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Failed to update leave status");
        return;
      }

      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave.id === id ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (err) {
      console.error("Error updating leave:", err);
    }
  };

  const filteredLeaves = leaves
    .filter((item) =>
      item.emp_id?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      statusFilter
        ? item.status?.toLowerCase() === statusFilter.toLowerCase()
        : true
    );

  return (
    <div className="leave-admin-page">
      <h2 className="leave-admin-title">Manage Leaves</h2>

      <div className="leave-admin-top">
        <input
          type="text"
          placeholder="Search By Emp ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="leave-admin-search"
        />

        <div className="leave-admin-filters">
          <button
            className={statusFilter === "Pending" ? "active" : ""}
            onClick={() => setStatusFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={statusFilter === "Approved" ? "active" : ""}
            onClick={() => setStatusFilter("Approved")}
          >
            Approved
          </button>
          <button
            className={statusFilter === "Rejected" ? "active" : ""}
            onClick={() => setStatusFilter("Rejected")}
          >
            Rejected
          </button>
          <button
            className={statusFilter === "" ? "active" : ""}
            onClick={() => setStatusFilter("")}
          >
            All
          </button>
        </div>
      </div>

      <div className="leave-admin-table-wrap">
        <table className="leave-admin-table">
          <thead>
            <tr>
              <th>S No</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Leave Type</th>
              <th>Department</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td>{index + 1}</td>
                  <td>{leave.emp_id}</td>
                  <td>{leave.name}</td>
                  <td>{leave.leave_type}</td>
                  <td>{leave.department}</td>
                  <td>
                    {leave.from_date
                      ? new Date(leave.from_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {leave.to_date
                      ? new Date(leave.to_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span className={`leave-badge ${leave.status?.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    <div className="leave-action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => updateLeaveStatus(leave.id, "Approved")}
                        disabled={leave.status === "Approved"}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                        disabled={leave.status === "Rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="leave-empty-row">
                  No leave records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}