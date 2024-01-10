import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const AssignedIssues = () => {
  const [assignments, setAssignments] = useState([]);
  const [technicianId, setTechnicianId] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();
  // const { technicianId } = useParams();

  const fetchAssignments = async () => {
    try {
      // Make a GET request to the specific technician's assignments endpoint
      // console.log("fetchassignments id: " ,technicianId);
      const response = await axios.get(`http://localhost:5000/techAssignments/${technicianId}`);
      const assignmentsData = response.data.assignments;
      // console.log(assignmentsData);
      setAssignments(assignmentsData);
    } catch (error) {
      setError('Error fetching assignments. Please try again.'); // Set error state
    } finally {
      setLoading(false); // Set loading state to false after completion
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading state to true initially
    // Retrieve technician ID from login details or user context
    const retrievedTechnicianId = "657c5a4e6bef093354653d28";
    // console.log("retrived_id: ", retrievedTechnicianId);
    setTechnicianId(retrievedTechnicianId);
    fetchAssignments();
  }, [technicianId]);

  // Define handleRetry function to clear error and refetch assignments
  const handleRetry = () => {
    setError(null);
    fetchAssignments();
  };

  return (
    <div className="container">
      {loading && <p className="loading-message">Loading assignments...</p>}
      {error && <div className="error-message">{error} <button onClick={() => handleRetry()}>Retry</button></div>}
      <h1 className="py-4">Your Assignments</h1>
      <hr />
      <Table striped bordered hover responsive="md" className="table table-sm">
        <thead>
          <tr>
            <th>Issue ID</th>
            {/* <th>Category</th> */}
            <th>Issue</th>
            <th>Reported By</th>
            <th>Reported On</th>
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
              {/* <td>{assignment.category.category_name}</td> */}
              <td>{assignment.issue.issue_message}</td>
              <td>{assignment.user.user_name}</td>
              <td>{moment(assignment.issue.createdAt).format("DD/MM/YYYY")}</td>
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
                      `/technicians/dashboard/assignments-details/${assignment._id}`,
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
};

export default AssignedIssues;
