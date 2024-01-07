import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Assignments() {
  // Define a state variable to store the assignments data
  const [assignments, setAssignments] = useState([]);
  // Define a variable to get the navigate function from the useNavigate hook
  const navigate = useNavigate();
  // Define a function that fetches the assignments data from the server
  const fetchAssignments = async () => {
    try {
      // Make a GET request to the /api/assignments endpoint
      const response = await axios.get("http://localhost:5000/assignments");
      // Update the state variable with the response data
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
      <Table striped bordered hover responsive="md">
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Issue Message</th>
            <th>Category</th>
            <th>Technician</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.issue.id}</td>
              <td>{assignment.issue.issue_message}</td>
              {/* <td>{assignment.issue.issue_status}</td> */}
              <td>{assignment.category.category_name}</td>
              <td>{assignment.technician.user_name}</td>
              <td>{assignment.status}</td>
              <td>{assignment.priority}</td>
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
