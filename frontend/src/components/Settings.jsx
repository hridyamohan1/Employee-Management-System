import { useState } from "react";
import AxiosInstance from "./AxiosInstance";
import "./admin.css";

export default function Settings() {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      alert("All fields are required");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await AxiosInstance.post("admin-change-password/", {
        old_password: formData.old_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });

      alert(res.data.message || "Password changed successfully");

      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.log("Change password error:", error.response?.data || error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.non_field_errors?.[0] ||
        "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-page">
      <div className="salary-card" style={{ maxWidth: "430px" }}>
        <h2 className="salary-title">Change Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Old Password</label>
            <input
              type="password"
              name="old_password"
              placeholder="Old Password"
              value={formData.old_password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="salary-btn" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}