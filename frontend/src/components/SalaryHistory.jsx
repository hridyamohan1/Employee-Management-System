import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AxiosInstance from "./AxiosInstance";

export default function SalaryHistory() {
  const { employeeId } = useParams();
  const location = useLocation();
  const employee = location.state?.employee;

  const [salaryList, setSalaryList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSalaryHistory();
  }, [employeeId]);

  const fetchSalaryHistory = async () => {
    try {
      const res = await AxiosInstance.get(`salary/?employee=${employeeId}`);
      setSalaryList(res.data);
    } catch (error) {
      console.log("Error fetching salary history:", error);
    }
  };

  const filteredSalary = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return salaryList;

    return salaryList.filter((item) => {
      const empIdText = String(
        employee?.emp_id || item.employee_emp_id || item.employee
      ).toLowerCase();

      return empIdText.includes(q);
    });
  }, [salaryList, search, employee]);

  return (
    <div className="employees-page">
      <div className="employees-topbar">
        <h2>Salary History</h2>
      </div>

      {/* <div className="employees-controls">
        <input
          type="text"
          placeholder="Search By Emp ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="employee-search"
        />
      </div> */}

      <div className="employees-table-card">
        <table className="employees-table">
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
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{employee?.emp_id || item.employee}</td>
                  <td>{item.basic_salary}</td>
                  <td>{item.allowances}</td>
                  <td>{item.deductions}</td>
                  <td>{item.net_salary}</td>
                  <td>{item.pay_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No salary history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}