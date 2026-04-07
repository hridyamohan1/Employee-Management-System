import { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance";
import "./admin.css";

export default function Salary() {
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [formData, setFormData] = useState({
    department: "",   // store department id
    employee: "",     // store employee id
    basic_salary: "",
    allowances: "",
    deductions: "",
    pay_date: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await AxiosInstance.get("departments/");
      setDepartments(res.data);
    } catch (error) {
      console.log("Department fetch error:", error);
    }
  };

  const fetchEmployeesByDepartment = async (departmentId) => {
    try {
      const res = await AxiosInstance.get(`employees/?department=${departmentId}`);
      setFilteredEmployees(res.data);
    } catch (error) {
      console.log("Employee fetch error:", error);
      setFilteredEmployees([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        employee: "",
      }));

      if (value) {
        await fetchEmployeesByDepartment(value);
      } else {
        setFilteredEmployees([]);
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      department: Number(formData.department),
      employee: Number(formData.employee),
      basic_salary: formData.basic_salary,
      allowances: formData.allowances || 0,
      deductions: formData.deductions || 0,
      pay_date: formData.pay_date,
    };

    console.log("Submitting payload:", payload);

    try {
      await AxiosInstance.post("salary/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Salary added successfully");

      setFormData({
        department: "",
        employee: "",
        basic_salary: "",
        allowances: "",
        deductions: "",
        pay_date: "",
      });
      setFilteredEmployees([]);
    } catch (error) {
      console.log("Salary create error:", error.response?.data || error);
      alert(
        error.response?.data?.employee?.[0] ||
        error.response?.data?.department?.[0] ||
        error.response?.data?.pay_date?.[0] ||
        "Failed to add salary"
      );
    }
  };

  return (
    <div className="salary-page">
      <div className="salary-card">
        <h2 className="salary-title">Add New Salary</h2>

        <form onSubmit={handleSubmit}>
          <div className="salary-grid">
            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Employee</label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>
                {filteredEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Basic Salary</label>
              <input
                type="number"
                name="basic_salary"
                placeholder="Insert Salary"
                value={formData.basic_salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Allowances</label>
              <input
                type="number"
                name="allowances"
                placeholder="Monthly Allowances"
                value={formData.allowances}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Deductions</label>
              <input
                type="number"
                name="deductions"
                placeholder="Monthly Deductions"
                value={formData.deductions}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Pay Date</label>
              <input
                type="date"
                name="pay_date"
                value={formData.pay_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="salary-btn">
            Add Salary
          </button>
        </form>
      </div>
    </div>
  );
}