import { useEffect, useState } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { BsHourglassSplit } from "react-icons/bs";
import AxiosInstance from "./AxiosInstance";

export default function Home() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  const [leaveApplied, setLeaveApplied] = useState(0);
  const [leaveApproved, setLeaveApproved] = useState(0);
  const [leavePending, setLeavePending] = useState(0);
  const [leaveRejected, setLeaveRejected] = useState(0);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchLeaves();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await AxiosInstance.get("employees/");
      console.log("employees response:", res.data);

      const employees = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
        ? res.data.results
        : [];

      setEmployeeCount(employees.length);
    } catch (error) {
      console.log("employees error:", error.response?.data || error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await AxiosInstance.get("departments/");
      console.log("departments response:", res.data);

      const departments = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
        ? res.data.results
        : [];

      setDepartmentCount(departments.length);
    } catch (error) {
      console.log("departments error:", error.response?.data || error.message);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await AxiosInstance.get("leaves/");
      console.log("leaves response:", res.data);

      const leaves = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
        ? res.data.results
        : [];

      setLeaveApplied(leaves.length);
      setLeaveApproved(
        leaves.filter((item) => item.status === "Approved").length
      );
      setLeavePending(
        leaves.filter((item) => item.status === "Pending").length
      );
      setLeaveRejected(
        leaves.filter((item) => item.status === "Rejected").length
      );
    } catch (error) {
      console.log("leaves error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="home-dashboard">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      <div className="stats-grid top-grid">
        <div className="stat-card">
          <div className="stat-icon teal">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p>{employeeCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <HiBuildingOffice2 />
          </div>
          <div className="stat-content">
            <h3>Total Departments</h3>
            <p>{departmentCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Monthly Pay</h3>
            <p>$1900</p>
          </div>
        </div>
      </div>

      <h2 className="section-title">Leave Details</h2>

      <div className="stats-grid leave-grid">
        <div className="stat-card">
          <div className="stat-icon teal">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Leave Applied</h3>
            <p>{leaveApplied}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Leave Approved</h3>
            <p>{leaveApproved}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <BsHourglassSplit />
          </div>
          <div className="stat-content">
            <h3>Leave Pending</h3>
            <p>{leavePending}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaTimesCircle />
          </div>
          <div className="stat-content">
            <h3>Leave Rejected</h3>
            <p>{leaveRejected}</p>
          </div>
        </div>
      </div>
    </div>
  );
}