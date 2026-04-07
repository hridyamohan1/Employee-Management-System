import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function EmployeeLeaveDetails() {
  const { id } = useParams();
  const [leaveDetails, setLeaveDetails] = useState([]);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchLeaveDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/employees/${id}/leave`);
        setEmployee(res.data.employee);
        setLeaveDetails(res.data.leaveDetails);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaveDetails();
  }, [id]);

  return (
    <div>
      <h2>Leave Details</h2>

      {employee && (
        <div>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Department:</strong> {employee.department}</p>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>S No</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveDetails.length > 0 ? (
            leaveDetails.map((leave, index) => (
              <tr key={leave._id}>
                <td>{index + 1}</td>
                <td>{leave.fromDate}</td>
                <td>{leave.toDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No leave records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeLeaveDetails;