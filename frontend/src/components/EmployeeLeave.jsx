import React, { useEffect, useState } from "react";
import "./admin.css";

export default function EmployeeLeave() {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    emp_id: "",
    name: "",
    department: "",
    leave_type: "Casual Leave",
    from_date: "",
    to_date: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        emp_id: user.emp_id || "",
        name: user.name || "",
        department: user.department || "",
      }));
    }
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.from_date || !form.to_date) {
      alert("Please select both from date and to date");
      return;
    }

    if (new Date(form.to_date) < new Date(form.from_date)) {
      alert("To date must be greater than or equal to from date");
      return;
    }

    const payload = {
      emp_id: form.emp_id,
      name: form.name,
      department: form.department,
      leave_type: form.leave_type,
      from_date: form.from_date,
      to_date: form.to_date,
      description: form.description,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/leaves/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert("Failed to add leave");
        return;
      }

      setShowForm(false);
      setForm((prev) => ({
        ...prev,
        leave_type: "Casual Leave",
        from_date: "",
        to_date: "",
        description: "",
      }));
      fetchLeaves();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const filtered = leaves
    .filter((l) => l.emp_id === user?.emp_id)
    .filter((l) =>
      l.status?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="employee-leave-page">
      {!showForm ? (
        <>
          <h2 className="employee-leave-title">Manage Leaves</h2>

          <div className="employee-leave-top">
            <input
              className="employee-leave-search"
              type="text"
              placeholder="Search By Status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="employee-leave-add-btn"
              onClick={() => setShowForm(true)}
            >
              Add Leave
            </button>
          </div>

          <div className="employee-leave-table-wrap">
            <table className="employee-leave-table">
              <thead>
                <tr>
                  <th>SNO</th>
                  <th>LEAVE TYPE</th>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>APPLIED DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((l, i) => (
                    <tr key={l.id}>
                      <td>{i + 1}</td>
                      <td>{l.leave_type}</td>
                      <td>
                        {l.from_date
                          ? new Date(l.from_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {l.to_date
                          ? new Date(l.to_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {l.created_at
                          ? new Date(l.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <span className={`leave-status ${l.status?.toLowerCase()}`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="leave-empty-row">
                      No leave records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="leave-request-card">
          <h2 className="leave-request-title">Request for Leave</h2>

          <form onSubmit={handleSubmit} className="leave-request-form">
            <div className="leave-request-field">
              <label>Leave Type</label>
              <select
                name="leave_type"
                value={form.leave_type}
                onChange={handleChange}
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>

            <div className="leave-request-row">
              <div className="leave-request-field">
                <label>From Date</label>
                <input
                  type="date"
                  name="from_date"
                  value={form.from_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="leave-request-field">
                <label>To Date</label>
                <input
                  type="date"
                  name="to_date"
                  value={form.to_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="leave-request-field">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Reason"
                rows="4"
              />
            </div>

            <div className="leave-request-actions">
              <button type="submit" className="leave-request-submit-btn">
                Add Leave
              </button>
              <button
                type="button"
                className="leave-request-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}