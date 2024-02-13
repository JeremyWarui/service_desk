import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Table, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../auth/AuthContext";

const ResolvedAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();


  useEffect(() => {
    setLoading(true);
    const technicianId = user?._id;
    // console.log(technicianId);
    fetchAssignments(technicianId);
  }, [user]);

  const fetchAssignments = async (technicianId) => {
    try {
      console.log("fetchassignments id: " , technicianId);
      const response = await axios.get(
        `http://localhost:5000/techAssignments/${technicianId}`
      );
      const assignmentsData = response?.data.assignments;
      setAssignments(assignmentsData);
    } catch (error) {
      setError("Error fetching assignments. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Define handleRetry function to clear error and refetch assignments
  const handleRetry = () => {
    setError(null);
    fetchAssignments();
  };

  const filteredAssignments = assignments.filter(assignment => assignment.status === "completed");
  return (
    <div className="container">
      {loading && <p className="loading-message">Loading assignments...</p>}
      {/* {error && <div className="error-message">{error} <button onClick={() => handleRetry()}>Retry</button></div>} */}
      <h1 className="py-4">Resolved Assignments</h1>
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
            <th>Resolved On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.issue.issue_id}</td>
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
              <td>{moment(assignment.deadline).format("DD/MM/YYYY")}</td>
              <td>{moment(assignment.resolved_date).format("DD/MM/YYYY")}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(
                      `/technicians-dashboard/resolved-details/${assignment._id}`,
                      { state: { assignment } }
                    )
                  }
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResolvedAssignments;

