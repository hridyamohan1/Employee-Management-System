import React, { useEffect, useState } from "react";
import "./admin.css";

export default function EmployeeSalary() {
  const [salaryData, setSalaryData] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSalaryHistory();
  }, []);

  const fetchSalaryHistory = async () => {
    try {
      const employeeId = user?.id;
      const res = await fetch(
        `http://127.0.0.1:8000/salary/${employeeId ? `?employee=${employeeId}` : ""}`
      );
      const data = await res.json();
      setSalaryData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching salary history:", error);
      setSalaryData([]);
    }
  };

  const filteredSalary = salaryData.filter((item) => {
    const empIdValue = item.employee || item.emp_id || "";
    return String(empIdValue).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="employee-salary-page">
      <h2 className="employee-salary-title">Salary History</h2>

      {/* <div className="employee-salary-top">
        <div></div>
        <input
          type="text"
          placeholder="Search By Emp ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="employee-salary-search"
        />
      </div> */}

      <div className="employee-salary-table-wrap">
        <table className="employee-salary-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>EMP ID</th>
              <th>SALARY</th>
              <th>ALLOWANCE</th>
              <th>DEDUCTION</th>
              <th>TOTAL</th>
              <th>PAY DATE</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalary.length > 0 ? (
              filteredSalary.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.employee || 
                  item.emp_id || "-"}</td>
                  <td>{item.basic_salary}</td>
                  <td>{item.allowances}</td>
                  <td>{item.deductions}</td>
                  <td>{item.net_salary}</td>
                  <td>
                    {item.pay_date
                      ? new Date(item.pay_date).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="salary-empty-row">
                  No salary records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
