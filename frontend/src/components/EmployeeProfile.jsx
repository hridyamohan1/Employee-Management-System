import "./admin.css";

export default function EmployeeProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="employee-profile-page">
      <div className="employee-profile-card">
        <h2 className="employee-profile-title">Employee Details</h2>

        <div className="employee-profile-content">
          <div className="employee-profile-image-section">
            <img
              src={user?.image}
              className="employee-profile-image"
            />
          </div>

          <div className="employee-profile-info">
            <p>
              <strong>Name:</strong> {user?.name || "N/A"}
            </p>
            <p>
              <strong>Employee ID:</strong> {user?.emp_id || "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong> {user?.dob || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {user?.gender || "N/A"}
            </p>
            <p>
              <strong>Department:</strong> {user?.department || "N/A"}
            </p>
            <p>
              <strong>Designation:</strong> {user?.designation || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone || "N/A"}
            </p>
            <p>
              <strong>Join Date:</strong> {user?.join_date || "N/A"}
            </p>
            <p>
              <strong>Salary:</strong> {user?.salary || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}