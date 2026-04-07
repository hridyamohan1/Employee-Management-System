import { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance";

export default function AddEmployee() {
  const [form, setForm] = useState({
    emp_id: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    designation: "",
    salary: "",
    join_date: "",
    dob: "",
    password: "",
    image: null,
  });

  const [departments, setDepartments] = useState([]);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await AxiosInstance.get("departments/");
      setDepartments(response.data);
    } catch (error) {
      console.log("Fetch departments error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setErrorMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((prev) => ({
        ...prev,
        image: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();

      formData.append("emp_id", form.emp_id);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("gender", form.gender);
      formData.append("department", form.department);
      formData.append("designation", form.designation);
      formData.append("salary", form.salary);
      formData.append("join_date", form.join_date);
      formData.append("dob", form.dob);
      formData.append("password", form.password);

      if (form.image) {
        formData.append("image", form.image);
      }

      await AxiosInstance.post("employees/", formData);

      setMessage("Employee added successfully");

      setForm({
        emp_id: "",
        name: "",
        email: "",
        phone: "",
        gender: "",
        department: "",
        designation: "",
        salary: "",
        join_date: "",
        dob: "",
        password: "",
        image: null,
      });

      setPreview(null);
    } catch (error) {
      console.log("Add employee error:", error);
      console.log("Backend error:", error.response?.data);
      setErrorMessage("Failed to add employee");
    }
  };

  return (
    <div className="add-employee-page">
      <div className="page-header">
        <h2>Add New Employee</h2>
      </div>

      <div className="add-employee-card">
        <form className="add-employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee Id</label>
            <input
              type="text"
              name="emp_id"
              value={form.emp_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              step="0.01"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Join Date</label>
            <input
              type="date"
              name="join_date"
              value={form.join_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="text"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Add Employee
            </button>
          </div>
        </form>

        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}