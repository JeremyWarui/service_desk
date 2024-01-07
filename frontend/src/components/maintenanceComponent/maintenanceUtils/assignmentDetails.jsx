import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Form, Button, Alert, Row, Col } from "react-bootstrap";
// Change the hook from useHistory to useNavigate
import { useNavigate } from "react-router-dom";

function AssignmentDetails({ match, history, location }) {
  // Get the assignment id from the URL parameter
  const { id } = useParams();

  // Create a state variable to store the assignment data
  const [assignment, setAssignment] = useState(null);
  const [updatedAssignment, setUpdatedAssignment] = useState(null);
  const [message, setMessage] = useState("");
  const fetchAssignment = async () => {
    try {
      // Make a GET request to the /api/assignments/:id endpoint with the assignment id
      const response = await axios.get(
        `http://localhost:5000/assignments/${id}`
      );
      // Update the state variable with the response data
      const assignment = response.data.assignment;
      setAssignment(assignment);
      setUpdatedAssignment(assignment);
      console.log(assignment);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  // Call the fetchAssignment function when the component mounts or the id changes
  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const handleChange = (e) => {
    // Get the name and value of the input field
    const { name, value } = e.target;
    // Update the state variable with the new value
    setUpdatedAssignment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a PUT request to the server endpoint that updates the assignment by id
      const response = await axios
        .put(`http://localhost:5000/assignments/${id}`, updatedAssignment)
        .then(() => {
          navigate(-1); // Navigate to the previous page
        });
      setMessage(response.data.assignment);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };
  // Define a variable to get the navigate function from the useNavigate hook
  const navigate = useNavigate();
  // Define a function that handles the navigation to the previous page

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h1 className="py-4">Assignment Details</h1>
      <hr></hr>
      {assignment && (
        <>
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
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{assignment.issue.id}</td>
                <td>{assignment.issue.issue_message}</td>
                <td>{assignment.category.category_name}</td>
                <td>{assignment.technician.user_name}</td>
                <td>{assignment.status}</td>
                <td>{assignment.priority}</td>
                <td>{assignment.deadline}</td>
                <td>
                  {assignment.messages.map((message) => (
                    <div key={message._id}>
                      <p>
                        {message.sender.user_name}: {message.message}
                      </p>
                      <p>Sent on: {message.sent_date}</p>
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          </Table>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={updatedAssignment.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    name="priority"
                    value={updatedAssignment.priority}
                    onChange={handleChange}
                  >
                    <option value="1">High</option>
                    <option value="2">Medium</option>
                    <option value="3">Low</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="deadline">
                  <Form.Label>Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={updatedAssignment.deadline}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="message">
              <Form.Label>Add a message</Form.Label>
              <Form.Control
                type="text"
                name="message"
                value={updatedAssignment.message}
                onChange={handleChange}
              />
            </Form.Group>
            <Row className="mt-2">
              <Col md={6}>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Col>
              <Col md={6}>
                {message && <Alert variant="info">{message}</Alert>}
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </div>
  );
}

export default AssignmentDetails;
