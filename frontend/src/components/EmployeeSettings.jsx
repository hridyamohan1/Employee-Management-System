import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

export default function EmployeeSettings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    email: user?.email || "",
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      setError("All fields are required.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:8000/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to change password.");
        return;
      }

      // ✅ SUCCESS → LOGOUT + REDIRECT
      alert("Password changed successfully. Please login again.");

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      navigate("/"); // redirect to login

    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-settings-page">
      <div className="employee-settings-card">
        <h2 className="employee-settings-title">Change Password</h2>

        <form onSubmit={handleSubmit} className="employee-settings-form">
          <div className="employee-settings-field">
            <label>Old Password</label>
            <input
              type="password"
              name="old_password"
              placeholder="Change Password"
              value={formData.old_password}
              onChange={handleChange}
            />
          </div>

          <div className="employee-settings-field">
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
            />
          </div>

          <div className="employee-settings-field">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="employee-settings-error">{error}</p>}

          <button
            type="submit"
            className="employee-settings-btn"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}