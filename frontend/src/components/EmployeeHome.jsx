import { FaUsers } from "react-icons/fa";
import "./admin.css";

export default function EmployeeHome() {

const user = JSON.parse(localStorage.getItem("user"));


  return (
    <div className="emp-home">
      <div className="emp-home-card">
        <div className="emp-home-icon">
          <FaUsers />
        </div>

        <div className="emp-home-text">
          <h2>Welcome Back</h2>
          <h3>{user?.name || "Employee"}</h3>
        </div>
      </div>
    </div>
  );
}