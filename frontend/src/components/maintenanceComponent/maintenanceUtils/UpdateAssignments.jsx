import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table,Form,Button,Alert,Row, Col,Card,Spinner,FormGroup,FormControl,FormLabel} from "react-bootstrap";
import moment from "moment";

function UpdateAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState();
  const [updatedAssignment, setUpdatedAssignment] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`/api/assignments/${id}`);
        console.log(response);
        const assignment = response.data.assignment;
        
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

  console.log(assignment);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAssignment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(id);
      const response = await axios.patch(`/api/techAssignments/${id}`, updatedAssignment);
      console.log(id);
      console.log("patch: ", response);
      console.log("updated: ", updatedAssignment);
      setMessage("Assignment updated successfully!");
      navigate(-1); // Navigate back
    } catch (error) {
      console.log(error.message);
      setMessage(error.response.data.error);
    }
  };
  // Define a variable to get the navigate function from the useNavigate hook
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h1 className="py-4">Update Page</h1>
      <hr></hr>
      {loading && <Spinner animation="border" role="status">Loading...</Spinner>}
      {message && <Alert variant="info">{message}</Alert>}
      {assignment && (
        <>
          <Table striped bordered hover responsive="md" className="table table-sm">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Category</th>
                <th>Issue</th>
                <th>Reported by</th>
                <th>Reported On</th>
                <th>Technician</th>
                <th>Assigned On</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{assignment.id}</td>
                <td>{assignment.category}</td>
                <td>{assignment.issue}</td>
                <td>{assignment.raiseeName}</td>
                <td>{moment(assignment.reportedDate).format("DD/MM/YYYY")}</td>
                <td>{assignment.technician}</td>
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
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    {/* <option value="completed">Closed</option> */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    name="priority"
                    value={updatedAssignment.priority ?? "3"}
                    onChange={handleChange}
                  >
                    <option value="1">High</option>
                    <option value="2">Medium</option>
                    <option value="3">Low</option>
                  </Form.Control>
                  {console.log(updatedAssignment)}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="deadline">
                  <Form.Label>Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={updatedAssignment.deadline || new Date().toISOString().slice(0, 10)}
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

export default UpdateAssignment;
