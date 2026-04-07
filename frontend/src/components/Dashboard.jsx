export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Employees</h3>
          <p>120</p>
        </div>

        <div className="card">
          <h3>Departments</h3>
          <p>8</p>
        </div>

        <div className="card">
          <h3>Pending Leaves</h3>
          <p>14</p>
        </div>

        <div className="card">
          <h3>Monthly Salary</h3>
          <p>$45,000</p>
        </div>
      </div>
    </div>
  );
}