import React, { useState, useEffect } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("http://localhost:5000/issues");
        const sortedIssues = response.data.issues.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setIssues(sortedIssues);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div>
      <h1 className="my-4">All Issues</h1>
      <hr />
      {isLoading && <Spinner animation="border" />}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Issue</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date Reported</th>
              <th>Reported By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.issue_message}</td>
                <td>{issue.category.category_name}</td>
                <td>{issue.issue_status}</td>
                <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                <td>{issue.user.user_name}</td>
                <td>
                  {/* Add buttons for actions, e.g., view details, update status */}
                  <Button size="sm" variant="primary">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AllIssues;
