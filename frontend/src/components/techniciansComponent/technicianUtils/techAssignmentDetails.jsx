import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Form, Button, Alert, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function TechAssignmentDetails({ match, history, location }) {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [updatedAssignment, setUpdatedAssignment] = useState(null);
  const [message, setMessage] = useState("");
  const fetchAssignment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/assignments/${id}`
      );
      const assignment = response.data.assignment;
      setAssignment(assignment);
      setUpdatedAssignment(assignment);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
                // Display a success message
          alert("Assignment updated successfully");
          navigate(-1); // Navigate to the previous page
        });
      setMessage(response.data.assignment);
    } catch (error) {
      alert("Error updating assignment. Please try again.");
      setMessage(error.response.data.error);
    }
  };
  // Define a variable to get the navigate function from the useNavigate hook
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h1 className="py-4">Assignment Details</h1>
      <hr></hr>
      {assignment && (
        <>
          <Table striped bordered hover responsive="md" className="table table-sm">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Issue</th>
                <th>Reported by</th>
                <th>Reported On</th>
                <th>Assigned On</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{assignment.id}</td>
                <td>{assignment.issue}</td>
                <td>{assignment.raiseeName}</td>
                <td>{moment(assignment.reportedDate).format("DD/MM/YYYY")}</td>
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
              </tr>
            </tbody>
          </Table>
          <hr></hr>
          <h3>Messages:</h3>
          {assignment.messages.map((message) => (
            <Card message={message} className="mb-3 border">
              <Card.Body>
                <Card.Title>{message.sender.user_name}</Card.Title>
                <Card.Text>{message.message}</Card.Text>
                <Card.Text>Sent on: {message.sent_date}</Card.Text>
              </Card.Body>
            </Card>
          ))}
          <hr />
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
                  <Form.Label>Resolved Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={updatedAssignment.resolved_date}
                    onChange={handleChange}
                  />
                  {console.log(updatedAssignment.resolved_date)}
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

export default TechAssignmentDetails;
