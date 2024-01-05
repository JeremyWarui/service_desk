import React, { useState, useEffect } from "react";
import { Form, FormGroup, FormControl, Button, Alert } from "react-bootstrap";
import axios from "axios";

const ReportIssueForm = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    // Fetch categories from the backend API
    axios
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error(error);
        // Handle category fetching errors
      });

    // Fetch current user ID (replace with your actual logic)
    axios
      .get("/current-user") // Assuming this endpoint provides the user ID
      .then((response) => {
        // setCurrentUserId(response.data.id); // Assuming ID is in the response
      })
      .catch((error) => {
        console.error(error);
        // Handle user ID fetching errors
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form data before submitting
    if (!title || !selectedCategory || !description) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("/issues", {
        category_id: selectedCategory._id, // Use the ID from the selected category object
        issue_message: description,
        // user_id: currentUserId, // Use the fetched user ID
        issue_status: "open",
      });

      console.log(response.data);
      setTitle("");
      setSelectedCategory(null);
      setDescription("");
      setSubmitError(null);
      // Display a success message or redirect as needed
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to submit issue. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      <FormGroup className="m-4">
        <Form.Label>Issue Title</Form.Label>
        <FormControl
          type="text"
          placeholder="Enter a concise issue summary"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </FormGroup>
      <FormGroup className="m-4">
        <Form.Label>Category</Form.Label>
        <FormControl
          as={"select"}
          defaultValue=""
          required
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category}>
              {category.name}
            </option>
          ))}
        </FormControl>
      </FormGroup>
      <FormGroup className="m-4">
        <Form.Label>Description</Form.Label>
        <FormControl
          as={"textarea"}
          rows={5}
          placeholder="Provide a clear and detailed description of the issue"
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </FormGroup>

      <Button variant="primary" type="submit" className="ml-5">
        Report Issue
      </Button>
    </Form>
  );
};

export default ReportIssueForm;
