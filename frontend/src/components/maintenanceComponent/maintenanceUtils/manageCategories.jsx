import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import axios from "axios";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories from your data source
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories"); // Replace with your API endpoint
        const data = response.data;
        console.log(data);
        // Set categories state to the categories array inside the data object, not the whole data object
        setCategories(data.categories); 
      } catch (error) {
        // Handle the error here
        console.error(error);
        setError(error);
      }
    };

    fetchCategories();
  }, []);

  const createCategory = async () => {
    // Send request to create a new category
    try {
      const response = await axios.post("http://localhost:5000/categories", {
        name: newCategoryName,
      });
      const newCategory = response.data;
      setCategories([...categories, newCategory]); // Add new category to the list
      setNewCategoryName(""); // Clear the form input
    } catch (error) {
      // Handle error (e.g., display an error message)
      console.error("Error creating category:", error);
      // You might want to display an error message to the user here
    }
  };

  return (
    <div>
      <h2>Manage Categories</h2>
      {error && <p className="error">Something went wrong: {error.message}</p>}
      {/* Use conditional rendering to check if categories state exists*/ }
      {categories ? (
        // Render the table only when categories state exists
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.category_name}</td>
                <td>
                  <Button variant="primary" size="sm">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        // Render a loading message or a spinner when categories state is undefined or null
        <p>Loading categories...</p>
      )}
      <Form onSubmit={createCategory}>
        <Form.Group>
          <Form.Label>New Category Name</Form.Label>
          <Form.Control
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Category
        </Button>
      </Form>
    </div>
  );
};

export default ManageCategories;
