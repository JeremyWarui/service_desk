import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Form, Select } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext }from "../userContext/AuthContext"; // Assuming your auth context path

import axios from "axios";
import moment from "moment";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const navigate = useNavigate();

  // Retrieve user ID from context
  const { user } = useContext(AuthContext);
  useEffect(() => {
    // Fetch available categories
    axios.get("http://localhost:5000/categories")
      .then((response) => setAvailableCategories(response.data.categories))
      .catch((error) => console.error(error));

    fetchIssues(); // Fetch issues initially
  }, []);

  const fetchIssues = async () => {
    const categoryId = selectedCategory;

    try {
      const response = await axios.get(`http://localhost:5000/users/${user._id}/issues`);
      const filteredIssues = categoryId
        ? response.data.issues.filter((issue) => issue.category._id === categoryId)
        : response.data.issues;
      setIssues(filteredIssues);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchIssues(); // Refetch issues when category changes
  }, [selectedCategory]);

  
  return (
    <div>
      <h1 className="my-3">My Issues</h1>
      <hr />
      <Form>
        <Form.Group controlId="categoryFilter">
          <Form.Label>Filter by Category:</Form.Label>
          <Form.Select
            className="mb-4"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.category_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
      <Table className="table" striped bordered hover responsive>
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Issue</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date Reported</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td>{issue._id}</td>
              <td>{issue.issue_message}</td>
              <td>{issue.category.category_name}</td>
              <td>{issue.issue_status}</td>
              <td>{moment(issue.createdAt).format("DD/MM/YYYY")}</td>
              <td>
              <Button variant="primary" size="sm" onClick={() => {
                console.log(issue.issue_message);
                navigate(`/users/dashboard/issue-details/${issue._id}`)}
              }>
                View Details
              </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyIssues;
