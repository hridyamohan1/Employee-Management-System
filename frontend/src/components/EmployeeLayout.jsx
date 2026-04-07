import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaCalendarAlt, FaMoneyBill, FaCog } from "react-icons/fa";
import "./admin.css";

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/");
  };


  return (
    <div className="emp-layout">
      
      <aside className="emp-sidebar">
        <div className="emp-logo">Employee MS</div>

        <nav className="emp-nav">
          <NavLink to="/employee_home" className={({ isActive }) => `emp-nav-link ${isActive ? "active" : ""}`}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/employee_profile" className={({ isActive }) => `emp-nav-link ${isActive ? "active" : ""}`}>
            <FaUser />
            <span>My Profile</span>
          </NavLink>

          <NavLink to="/employee_leave" className={({ isActive }) => `emp-nav-link ${isActive ? "active" : ""}`}>
            <FaCalendarAlt />
            <span>Leave</span>
          </NavLink>

          <NavLink to="/employee_salary" className={({ isActive }) => `emp-nav-link ${isActive ? "active" : ""}`}>
            <FaMoneyBill />
            <span>Salary</span>
          </NavLink>

          <NavLink to="/employee_settings" className={({ isActive }) => `emp-nav-link ${isActive ? "active" : ""}`}>
            <FaCog />
            <span>Setting</span>
          </NavLink>
        </nav>
      </aside>

      <div className="emp-main">
        <header className="emp-topbar">
          <div className="emp-welcome">
            Welcome, {user?.name || user?.email || "Employee"}
          </div>

          <button className="emp-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="emp-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
