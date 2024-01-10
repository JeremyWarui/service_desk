import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./tablesStyles.css";

function Assignments() {
  // Define a state variable to store the assignments data
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const fetchAssignments = async () => {
    try {
      // Make a GET request to the /api/assignments endpoint
      const response = await axios.get("http://localhost:5000/assignments");
      const allAssignments = response.data.assignments;
      setAssignments(allAssignments);
      console.log(allAssignments);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };
  // Call the fetchAssignments function when the component mounts
  useEffect(() => {
    fetchAssignments();
  }, []);

  // Return the JSX code to render the component
  return (
    <div className="container">
      <h1 className="py-4">Assignments</h1>
      <hr></hr>
      <Table striped bordered hover responsive="md" className="table table-sm">
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Category</th>
            <th>Issue</th>
            <th>Reported By</th>
            <th>Reported On</th>
            <th>Assigned To</th>
            <th>Assigned On</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment._id}</td>
              <td>{assignment.category.category_name}</td>
              <td>{assignment.issue.issue_message}</td>
              <td>{assignment.user.user_name}</td>
              <td>{moment(assignment.issue.createdAt).format("DD/MM/YYYY")}</td>
              <td>{assignment.technician.user_name}</td>
              <td>{moment(assignment.assigned_date).format("DD/MM/YYYY")}</td>
              <td>{assignment.status}</td>
              <td>
                {assignment.priority === 1 ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>High</span>
                ) : assignment.priority === 2 ? (
                  <span style={{ color: "orange", fontWeight: "bold" }}>Medium</span>
                ) : (
                  <span style={{ color: "green", fontWeight: "bold" }}>Low</span>
                )}
              </td>
              <td>{assignment.deadline}</td>
              <td>
                {/* Use the Button component to create a button that navigates to the assignment details page */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/maintenance/dashboard/assignments/${assignment._id}`,
                      { state: { assignment } }
                    )
                  }
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Assignments;
