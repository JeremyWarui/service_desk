import React, { useState, useEffect } from "react";
import { Spinner, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const ReportIssueForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [issueMessage, setIssueMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user ID from context
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data.categories);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    try {
      await axios.post("http://localhost:5000/issues", {
        user: user._id, // Include user ID in the request
        category: selectedCategory,
        issue_message: issueMessage,
      });
      setSuccess("Successfully submitted your issue!");
      setTimeout(() => {
        navigate("/users-dashboard/my-issues"); 
      }, 1000);
      // Redirect to myIssues after successful submission
    } catch (error) {
      // Handle submission error
      console.error(error);
      setError("Failed to submit issue. Please try again.");
    }
  };

  return (
    <>
    <h1 className="my-3">Post New Issue</h1>
    <hr />
    <Card>
      <Card.Header>New Issue</Card.Header>
      <Card.Body>
        {isLoading && <Spinner animation="border" />}
        {success && <Alert variant="success">{success}</Alert>}
        {error && <div>{error.message}</div>}
        {!isLoading && !error && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="issueCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4" controlId="issueMessage">
              <Form.Label>Issue Message</Form.Label>
              <Form.Control as="textarea" rows={5} value={issueMessage} onChange={(e) => setIssueMessage(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Issue
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
    </>
  );
};

export default ReportIssueForm;
