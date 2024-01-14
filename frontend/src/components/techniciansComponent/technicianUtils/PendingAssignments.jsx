import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const PendingAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [technicianId, setTechnicianId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('due_date'); // Add sorting state
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchedTechnicianId = "657c5a4e6bef093354653d28"; // Replace with actual retrieval
    setTechnicianId(fetchedTechnicianId);
    fetchAssignments();
  }, [technicianId]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/techAssignments/${technicianId}`);
      const assignmentsData = response.data.assignments;
      setAssignments(assignmentsData);
    } catch (error) {
      setError('Error fetching assignments. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
  ];

  const filteredAssignments = assignments.filter(
    (assignment) => assignment.status === "in-progress" || assignment.status === "pending"
  ).sort((a, b) => {
    if (sortBy === 'priority') {
      return a.priority - b.priority;
    } else if (sortBy === 'due_date') {
      return new Date(b.deadline) - new Date(a.deadline);
    }
    return 0;
  });

  return (
    <div className="container">
      {loading && <p className="loading-message">Loading assignments...</p>}
      {/* {error && <div className="error-message">{error}</div>} */}
      <h1 className="py-4">Pending Assignments</h1>
      <hr />
      <div className="d-flex justify-content-between mb-3">
        <h4 className="mb-0">Sort By:</h4>
        <DropdownButton
          as={ButtonGroup}
          title={sortOptions.find((option) => option.value === sortBy).label}
          onSelect={(event) => setSortBy(event.key)}
        >
          {sortOptions.map((option) => (
            <Dropdown.Item key={option.value} eventKey={option.value}>
              {option.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
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
          {filteredAssignments.map((assignment) => (
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
                      `/technicians-dashboard/assignments-details/${assignment._id}`,
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

export default PendingAssignments;
