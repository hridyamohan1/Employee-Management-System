import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AxiosInstance from "./AxiosInstance";
import "./admin.css";

export default function ViewLeaveAdmin() {
  const { id } = useParams();
  const location = useLocation();

  const [employee, setEmployee] = useState(location.state?.employee || null);
  const [leaveDetails, setLeaveDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        let currentEmployee = location.state?.employee || null;

        if (!currentEmployee) {
          const employeeRes = await AxiosInstance.get(`employees/${id}/`);
          currentEmployee = employeeRes.data;
          setEmployee(currentEmployee);
        }

        const leaveRes = await AxiosInstance.get(`employees/${id}/leave/`);
        const leaveData = Array.isArray(leaveRes.data) ? leaveRes.data : [];

        setLeaveDetails(leaveData);
      } catch (error) {
        console.log("Error fetching leave data:", error);

        if (error.response?.status === 404) {
          setErrorMessage("Leave API not found. Check your backend route.");
        } else if (error.response?.data?.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("Failed to load leave details.");
        }

        setLeaveDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [id, location.state]);

  return (
    <div className="leave-page">
      <div className="leave-header">
        <div>
          <h2>Employee Leave Details</h2>
          {employee && (
            <p className="leave-subtitle">
              {employee.name} - {employee.department}
            </p>
          )}
        </div>

        <Link to="/home/employees" className="back-btn">
          Back
        </Link>
      </div>

      <div className="leave-card">
        {loading ? (
          <p className="leave-message">Loading leave details...</p>
        ) : errorMessage ? (
          <p className="leave-message">{errorMessage}</p>
        ) : leaveDetails.length > 0 ? (
          <table className="leave-table">
            <thead>
              <tr>
                <th>S No</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveDetails.map((leave, index) => (
                <tr key={leave.id || index}>
                  <td>{index + 1}</td>
                  <td>{leave.leave_type || "-"}</td>
                  <td>{leave.from_date || "-"}</td>
                  <td>{leave.to_date || "-"}</td>
                  <td>{leave.description || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${String(
                        leave.status || "pending"
                      ).toLowerCase()}`}
                    >
                      {leave.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="leave-message">
            No leave records found for this employee.
          </p>
        )}
      </div>
    </div>
  );
}