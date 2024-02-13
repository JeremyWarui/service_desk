import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Form,
  FormControl,
  Select,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./tablesStyles.css";

function Assignments() {
  // Define a state variable to store the assignments data
  const [assignments, setAssignments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const fetchTechnicians = async () => {
    try {
      const response = axios.get("http://localhost:5000/users");
      response
        .then((response) => {
          const technicians = response.data.users.filter(
            (user) => user.user_role === "technician"
          );
          setTechnicians(technicians);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = axios.get("http://localhost:5000/categories");
      response
        .then((response) => {
          const categories = response.data.categories;
          setCategories(categories);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/assignments");
        const allAssignments = response.data.assignments;
        const filteredAssignments = allAssignments
          .filter(
            (assignment) =>
              !selectedTechnician || assignment.technician._id === selectedTechnician
            )
          .filter(
            (assignment) => !selectedStatus || assignment.status === selectedStatus
          )
          .filter(
            (assignment) =>
              !selectedCategory || assignment.category._id === selectedCategory
          );
          // console.log(allAssignments);
          const sortedAssignments = filteredAssignments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAssignments(sortedAssignments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
    fetchTechnicians();
    fetchAssignments();
  }, [selectedTechnician, selectedStatus, selectedCategory]);

  const handleTechnicianChange = (event) => {
    setSelectedTechnician(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  // Return the JSX code to render the component
  return (
    <div className="container">
      <h1 className="py-3">Assigned Tasks</h1>
      <hr></hr>
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group controlId="filterCategory">
              <Form.Label>Filter by Category:</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="filterTechnician">
              <Form.Label>Filter by Technician:</Form.Label>
              <Form.Control
                as="select"
                value={selectedTechnician}
                onChange={handleTechnicianChange}
              >
                <option value="">Select a technician</option>
                <option value="">All technicians</option>
                {technicians.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.user_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="filterStatus">
              <Form.Label>Filter by Status:</Form.Label>
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="">Select Status</option>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover responsive="sm" className="table table-sm">
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Category</th>
            <th>Issue</th>
            <th>Reported By</th>
            <th>Reported On</th>
            <th>Assigned To</th>
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
              <td>{assignment.issue.issue_id}</td>
              <td>{assignment.category.category_name}</td>
              <td>{assignment.issue.issue_message}</td>
              <td>{assignment.user.user_name}</td>
              <td>{moment(assignment.issue.createdAt).format("DD/MM/YYYY")}</td>
              <td>{assignment.technician.user_name}</td>
              <td>{moment(assignment.assigned_date).format("DD/MM/YYYY")}</td>
              <td>{assignment.status}</td>
              <td>
                {assignment.priority === 1 ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>High</span>
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
              <td>
                {/* Use the Button component to create a button that navigates to the assignment details page */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/maintenance-dashboard/assignments/${assignment._id}`,
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
}

export default Assignments;
