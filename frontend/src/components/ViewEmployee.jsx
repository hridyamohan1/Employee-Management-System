import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./admin.css";

export default function ViewEmployee() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const employee = location.state?.employee;

  if (!employee) {
    return (
      <div className="view-employee-page">
        <div className="view-employee-card">
          <h2 className="view-employee-title">Employee Details</h2>
          <p>Employee data not available.</p>
          <button
            className="btn-action btn-view"
            onClick={() => navigate("/home/employees")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-employee-page">
      <div className="view-employee-card">
        <h2 className="view-employee-title">Employee Details</h2>

        <div className="view-employee-content">
          <div className="view-employee-image-section">
            {employee.image ? (
              <img
                src={employee.image}
                alt={employee.name}
                className="view-employee-image"
              />
            ) : (
              <div className="view-employee-placeholder">
                {employee.name?.charAt(0)?.toUpperCase() || "E"}
              </div>
            )}
          </div>

          <div className="view-employee-details">
            <p>
              <strong>Name:</strong> {employee.name || "-"}
            </p>
            <p>
              <strong>Employee ID:</strong>{" "}
              {employee.employee_id || employee.emp_id || employee.id || id || "-"}
            </p>
            <p>
              <strong>Date of Birth:</strong> {employee.dob || employee.join_date || "-"}
            </p>
            <p>
              <strong>Gender:</strong> {employee.gender || "-"}
            </p>
             <p>
              <strong>Date of Birth:</strong> {employee.dob || "-"}
            </p>
            <p>
              <strong>Department:</strong> {employee.department || "-"}
            </p>
            {/* <p>
              <strong>Marital Status:</strong>{" "}
              {employee.marital_status || employee.maritalStatus || "-"}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}