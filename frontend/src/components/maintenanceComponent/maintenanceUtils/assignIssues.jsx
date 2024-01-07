import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  FormControl,
  FormGroup,
  Table,
  Badge,
} from "react-bootstrap";
import moment from "moment";

const AssignIssues = () => {
  const [issue, setIssue] = useState(null);
  const [selected, setSelected] = useState({
    technician: "",
    status: "",
  });
  const [technicians, setTechnicians] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const match = useParams();
  const location = useLocation();

  // Fetch the issue data from the location state
  useEffect(() => {
    const issue = location.state.issue;
    console.log(issue);
    setIssue(issue);
  }, [location.state.issue]);

  // Fetch the technicians data from the server
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        const data = response.data;
        const technicians = data.users.filter(
          (user) => user.user_role === "technician"
        );
        setTechnicians(technicians);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTechnicians();
  }, []);

  // Set the initial values of the selected state variable
  useEffect(() => {
    if (issue) {
      setSelected({
        technician: issue.assignedPerson,
        status: issue.status,
      });
    }
  }, [issue]);

  // Handle the change of the technician and status select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelected((prevSelected) => ({
      ...prevSelected,
      [name]: value,
    }));
  };

  // Handle the submission of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    confirmAssignments();
  };

  // Confirm the assignments and update the issue data
  const confirmAssignments = async () => {
    try {
      setLoading(true);
      // Check if the issue is not assigned to anyone yet
      if (!issue.assignedPerson.technician) {
        // Assign the issue to the selected technician and add to the assignment history
        await axios.patch(
          `http://localhost:5000/issues/${match.params.issue_id}`,
          {
            assignedPerson: {
              // Use assignedPerson instead of technician
              technician: selected.technician,
              assigned_date: Date.now(),
            },
            status: selected.status,
          }
        );
      } else {
        // Update the issue data as before
        await axios.patch(
          `http://localhost:5000/issues/${match.params.issue_id}`,
          {
            assignedPerson: {
              // Use assignedPerson instead of technician
              technician: selected.technician,
              assigned_date: Date.now(),
            },
            status: selected.status,
          }
        );
      }
      setLoading(false);
      setSuccess("Issue updated successfully!"); // Set success message
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/maintenance/dashboard/display-issues");
      }, 3000);
    } catch (error) {
      console.error("Error updating issue:", error);
      setLoading(false);
      setError("Something went wrong. Please try again."); // Set error message
    }
  };

  return (
    <Container>
      <h1 className="pt-4">Assign Issue</h1>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {issue && (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Card bg="light" border="primary" text="dark">
                <Card.Header>Issue ID: {issue._id}</Card.Header>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Message</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Category</td>
                      <td>{issue.category}</td>
                    </tr>
                    <tr>
                      <td>Message</td>
                      <td>{issue.issue_message}</td>
                    </tr>
                    <tr>
                      <td>Open Date</td>
                      <td>{moment(issue.open_date).format("DD/MM/YYYY")}</td>
                    </tr>
                    <tr>
                      <td>Assigned To</td>
                      <td>{issue.technician}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup controlId="technician">
                <p>Assign Technician</p>
                <FormControl
                  as="select"
                  name="technician"
                  value={selected.technician}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a technician</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.user_name}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="status">
              <p>Status</p>
                <FormControl
                  as="select"
                  name="status"
                  value={selected.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="submit" variant="primary">
                Confirm
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default AssignIssues;
