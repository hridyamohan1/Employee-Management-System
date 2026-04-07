import { useEffect, useMemo, useState } from "react";
import AxiosInstance from "./AxiosInstance";
import { Link } from "react-router-dom";
import "./admin.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await AxiosInstance.get("employees/");
      setEmployees(response.data);
    } catch (error) {
      console.log("Error fetching employees:", error);
    }
  };

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((emp) => {
      const idText = String(emp.id || "").toLowerCase();
      const nameText = String(emp.name || "").toLowerCase();
      const deptText = String(emp.department || "").toLowerCase();

      return (
        idText.includes(q) ||
        nameText.includes(q) ||
        deptText.includes(q)
      );
    });
  }, [employees, search]);

  return (
    <div className="employees-page">
      <div className="employees-topbar">
        <h2>Manage Employees</h2>
      </div>

      <div className="employees-controls">
        <input
          type="text"
          placeholder="Search By Department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="employee-search"
        />

        <Link to="/home/employees/add" className="add-employee-btn">
          Add Employee
        </Link>
      </div>

      <div className="employees-table-card">
        <table className="employees-table">
          <thead>
            <tr>
              <th>S No</th>
              <th>Image</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="employee-image-wrap">
                      {emp.image ? (
                        <img
                          src={emp.image}
                          alt={emp.name}
                          className="employee-image"
                        />
                      ) : (
                        <div className="employee-image placeholder">
                          {emp.name?.charAt(0)?.toUpperCase() || "E"}
                        </div>
                      )}
                    </div>
                  </td>

                  <td>{emp.name}</td>
                  <td>{emp.dob}</td>
                  <td>{emp.department}</td>

                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/home/employees/view/${emp.id}`}
                        state={{ employee: emp }}
                        className="btn-action btn-view"
                      >
                        View
                      </Link>

                      <Link
                        to={`/home/employees/edit/${emp.id}`}
                        className="btn-action btn-edit"
                      >
                        Edit
                      </Link>

                      <Link
                        to={`/home/salary-history/${emp.id}`}
                        state={{ employee: emp }}
                        className="btn-action btn-salary"
                      >
                        Salary
                      </Link>

                      <Link
                        to={`/home/employees/leave/${emp.id}`}
                        state={{ employee: emp }}
                        className="btn-action btn-leave"
                      >
                        Leave
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}