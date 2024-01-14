import React, { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import {Container,Row,Col,Form,Button,Alert,Card,Spinner,FormControl,FormGroup,Table,Badge} from "react-bootstrap";
import moment from "moment";

const CreateAssignment = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [selectedPriority, setPriority] = useState("3");
  const [selectedStatus, setStatus] = useState("in-progress")
  const [selectedDeadline, setDeadline] = useState("");
  const [issue, setIssue] = useState(null);
  const [parentIssue, setParentIssue] = useState();
  const [category_id, setCategoryId] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch the technicians data from the issues object
    const fetchTechnicians = async () => {
      try {
        const issue = location.state.issue;
        setIssue(issue);
        const response = await axios.get(`http://localhost:5000/issues/${issue._id}`);
        const data = response.data;
        setParentIssue(data.issue);
        setCategoryId(data.issue.issue.category._id);
        const technicians = data.issue.techniciansList;
        setTechnicians(technicians);
       } catch (error) {
        console.error(error);
      }
    };

    fetchTechnicians();
  }, [issue, location.state.issue]);

  // handle selected Technician
  function handleTechnician (e) {
    setSelectedTechnician(e.target.value);
  }
  // handle selected status
  function handleStatus(e) {
    setStatus(e.target.value);
  }
   // Handle priority change
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };
  // Handle deadline change
  const handleDeadlineChange = (event) => {
    setDeadline(event.target.value)
  };
  console.log(parentIssue);

  // Handle the submission of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Confirm the assignments to create assignment
    confirmAssignment();
  };
  
  async function confirmAssignment () {
    try {
      const newAssignment = {
        technician_id: selectedTechnician,
        issue_id: issue._id,
        category: category_id,
        status: selectedStatus,
        priority: selectedPriority,
        deadline: selectedDeadline || new Date().toISOString().slice(0, 10),
      };
      console.log(newAssignment);
      const response = await axios.post(`http://localhost:5000/issues/${issue._id}/assignments`, newAssignment);
      console.log(response);
      setLoading(false);
      setSuccess("Issue updated successfully!"); // Set success message
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/maintenance/dashboard/issues");
      }, 1000);
    } catch (error) {
      console.error("Error updating issue:", error);
      setLoading(false);
      setError("Something went wrong. Please try again."); // Set error message
    }
  }

  // // Handle the change of the technician and status select inputs
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelected((prevSelected) => ({
  //     ...prevSelected,
  //     [name]: value,
  //   }));
  // };
  
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
      {issue && technicians.length > 0 && (
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
                      <td>Issue Details</td>
                      <td>{issue.issue_message}</td>
                    </tr>
                    <tr>
                      <td>Reported On</td>
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
          <Row className="mt-4">
            <Col>
              <FormGroup controlId="technician">
                <p>Assign Technician</p>
                <FormControl
                  as="select"
                  name="technician"
                  value={selectedTechnician}
                  onChange={handleTechnician}
                  required
                >
                  {/* {console.log("selected technician: ", selectedTechnician)} */}
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
                  value={selectedStatus}
                  onChange={handleStatus}
                  required
                >
                  <option value="">Select a status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </FormControl>
                {/* {console.log(selectedStatus)} */}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <p>Priority</p>
                <Form.Select as="select" value={selectedPriority} onChange={handlePriorityChange}>
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </Form.Select>
              </FormGroup>
              {/* {console.log(selectedPriority)} */}
            </Col>
            <Col>
              <FormGroup>
                <p>Deadline</p>
                <Form.Control type="date" value={selectedDeadline} onChange={handleDeadlineChange} />
              </FormGroup>
              {console.log(selectedDeadline)}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button className="mt-4" type="submit" variant="primary">
                Confirm
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default CreateAssignment;
