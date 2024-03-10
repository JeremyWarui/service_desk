import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table,Form,Button,Alert,Row,Col,Card,Spinner } from "react-bootstrap";
import moment from "moment";
import { useAuth } from "../../auth/AuthContext";

function UpdateMyAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [updatedAssignment, setUpdatedAssignment] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`/api/assignments/${id}`);
        const assignment = response.data.assignment;
        console.log(assignment);
        setAssignment(assignment);
        setUpdatedAssignment(assignment);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setMessage("Error fetching assignment");
      }
    };
    fetchAssignment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAssignment((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(assignment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/api/techAssignments/${id}`,
        updatedAssignment
      );
      // console.log(updatedAssignment);
      setMessage("Assignment updated successfully!");
      navigate(-1); // Navigate back
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.error || "Error updating assignment");
    }
  };

  return (
    <div className="container">
      <h1 className="py-4">Assignment Details</h1>
      <hr></hr>
      {loading && <p className="loading-message">Loading ...</p>}
      {message && <Alert variant="info">{message}</Alert>}
      {assignment && (
        <>
          {/* Display assignment details table (adjust columns as needed) */}
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
                <td>{assignment.issue_id}</td>
                <td>{assignment.issue}</td>
                <td>{assignment.raiseeName}</td>
                <td>{moment(assignment.reportedDate).format("DD/MM/YYYY")}</td>
                <td>{moment(assignment.assigned_date).format("DD/MM/YYYY")}</td>
                <td>{assignment.status}</td>
                <td>
                  {assignment.priority === 1 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      High
                    </span>
                  ) : assignment.priority === 2 ? (
                    <span style={{ color: "orange", fontWeight: "bold" }}>
                      Medium
                    </span>
                  ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Low
                    </span>
                  )}
                </td>
                <td>{moment(assignment.deadline).format("DD/MM/YYYY")}</td>
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
                  {/* {console.log(updatedAssignment.resolved_date)} */}
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
                <Button variant="secondary" onClick={() => navigate(-1)}>
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

export default UpdateMyAssignment;
