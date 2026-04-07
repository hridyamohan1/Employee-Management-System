import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="logo">Employee MS</div>

        <nav className="menu">
          <Link
            to="/home"
            className={`menu-item ${location.pathname === "/home" ? "active" : ""}`}
          >
            Dashboard
          </Link>

          <Link
            to="/home/employees"
            className={`menu-item ${location.pathname === "/home/employees" ? "active" : ""}`}
          >
            Employee
          </Link>

          <Link
            to="/home/departments"
            className={`menu-item ${location.pathname === "/home/departments" ? "active" : ""}`}
          >
            Department
          </Link>

          <Link
            to="/home/leave"
            className={`menu-item ${location.pathname === "/home/leave" ? "active" : ""}`}
          >
            Leave
          </Link>

          <Link
            to="/home/salary"
            className={`menu-item ${location.pathname === "/home/salary" ? "active" : ""}`}
          >
            Salary
          </Link>

          <Link
            to="/home/settings"
            className={`menu-item ${location.pathname === "/home/settings" ? "active" : ""}`}
          >
            Settings
          </Link>
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="top-navbar">
          <div className="top-navbar-left">
            Welcome, {user.email || "Admin"}
          </div>

          <button className="logout-btn-top" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}