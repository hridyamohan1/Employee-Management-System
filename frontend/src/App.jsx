import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import AdminLayout from "./components/AdminLayout";
import Home from "./components/Home";

import Employees from "./components/Employees";
import Departments from "./components/Departments";
import Leave from "./components/Leave";
import Salary from "./components/Salary";
import Settings from "./components/Settings";
import AddEmployee from "./components/AddEmployee";

import ViewEmployee from "./components/ViewEmployee";
import EditEmployee from "./components/EditEmployee";

import EmployeeHome from "./components/EmployeeHome";
import SalaryHistory from "./components/SalaryHistory";

import EmployeeLayout from "./components/EmployeeLayout";
import EmployeeProfile from "./components/EmployeeProfile";
import EmployeeLeave from "./components/EmployeeLeave";
import EmployeeSalary from "./components/EmployeeSalary";
import EmployeeSettings from "./components/EmployeeSettings";
import ViewLeaveAdmin from "./components/ViewLeaveAdmin";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/home" element={<AdminLayout />}>
        <Route index element={<Home />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/add" element={<AddEmployee />} />
        <Route path="employees/view/:id" element={<ViewEmployee />} />
        <Route path="employees/edit/:id" element={<EditEmployee />} />
        <Route path="salary-history/:employeeId" element={<SalaryHistory />} />
        <Route path="/home/employees/leave/:id" element={<ViewLeaveAdmin />} />
        <Route path="departments" element={<Departments />} />
        <Route path="leave" element={<Leave />} />
        <Route path="salary" element={<Salary />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/" element={<EmployeeLayout />}>
        <Route path="employee_home" element={<EmployeeHome />} />
        <Route path="employee_profile" element={<EmployeeProfile />} />
        <Route path="employee_leave" element={<EmployeeLeave />} />
        <Route path="employee_salary" element={<EmployeeSalary />} />
        <Route path="employee_settings" element={<EmployeeSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;