import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Table, Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { TechnicianContext } from '../techContext/AuthContext';

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('priority'); // Add sorting state
  const [selectedSortOption, setSelectedSortOption] = useState('createdAt');
  const navigate = useNavigate();

  const { technician } = useContext(TechnicianContext);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/techAssignments/${technician._id}`);
      const assignmentsData = response.data.assignments;
      console.log(assignmentsData);
      setAssignments(assignmentsData);
      setLoading(false);
    } catch (error) {
      setError('Error fetching assignments. Please refresh the page.'); 
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading state to true initially
    fetchAssignments();
    // sortAssignments();
  }, [technician._id]);

  return (
    <div className="container">
      {loading && <p className="loading-message">Loading assignments...</p>}
      {error && <div className="error-message">{error.message}</div>}
      <h1 className="py-4">My Assignments</h1>
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
              <td>{moment(assignment.deadline).format("DD/MM/YYYY")}</td>
              <td>
                {/* Use the Button component to create a button that navigates to the assignment details page */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/technicians/dashboard/assignment-details/${assignment._id}`,
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

export default MyAssignments;
