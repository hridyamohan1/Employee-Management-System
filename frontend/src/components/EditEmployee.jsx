import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "./AxiosInstance";
import "./admin.css";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    // employee_id: "",
    name: "",
    dob: "",
    gender: "Male",
    marital_status: "Single",
    designation: "",
    department: "",
    salary: "",
    role: "Employee",
    image: null,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await AxiosInstance.get(`employees/${id}/edit/`);
      const data = response.data;

      setEmployee({
        // employee_id: data.employee_id || "",
        name: data.name || "",
        email : data.email || "",
        phone : data.phone || "",
        dob: formatDateForInput(data.dob),
        gender: data.gender || "Male",
        marital_status: data.marital_status || "Single",
        designation: data.designation || "",
        department: data.department || "",
        salary: data.salary || "",
        role: data.role || "Employee",
        image: data.image || null,
      });
    } catch (error) {
      console.log("Error fetching employee:", error);
      alert("Could not load employee details");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setEmployee((prev) => ({
        ...prev,
        image: files && files[0] ? files[0] : prev.image,
      }));
      return;
    }

    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
    //   formData.append("employee_id", employee.employee_id);
      formData.append("name", employee.name);
      formData.append("dob", employee.dob);
      formData.append("gender", employee.gender);
    //   formData.append("marital_status", employee.marital_status);
      formData.append("designation", employee.designation);
      formData.append("department", employee.department);
      formData.append("salary", employee.salary);
    //   formData.append("role", employee.role);

      if (employee.image instanceof File) {
        formData.append("image", employee.image);
      }

      await AxiosInstance.put(`employees/${id}/edit/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Employee updated successfully");
      navigate("/home/employees");
    } catch (error) {
      console.log("Error updating employee:", error);
      alert("Failed to update employee");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="employee-form-page">Loading...</div>;
  }

  return (
    <div className="employee-form-page">
      <div className="employee-form-card">
        <h2 className="employee-form-title">Edit Employee</h2>

        <form onSubmit={handleSubmit}>
          <div className="employee-form-grid">
            {/* <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={employee.employee_id}
                onChange={handleChange}
              />
            </div> */}
            <div className="form-group full-width">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
              />
            </div>


            <div className="form-group full-width">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={employee.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={employee.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={employee.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* <div className="form-group">
              <label>Marital Status</label>
              <select
                name="marital_status"
                value={employee.marital_status}
                onChange={handleChange}
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div> */}

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={employee.designation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Database">Database</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Salary</label>
              <input
                type="number"
                name="salary"
                value={employee.salary}
                onChange={handleChange}
              />
            </div>

            {/* <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={employee.role}
                onChange={handleChange}
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div> */}

            

            <div className="form-group full-width">
              <label>Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="update-employee-btn"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}