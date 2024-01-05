import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DisplayIssues = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await axios.get("http://localhost:5000/issues");
        const data = response.data;
        setIssues(data.issues);
        console.log("Issues array:", data.issues);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };
    fetchIssues();
  }, []);

  return (
    <>
      <div>
        <h2>Maintenance Issues</h2>
        {error && (
          <p className="error">Something went wrong: {error.message}</p>
        )}
        {isLoading ? ( <p>Loading issues...</p>
        ) : (
          // Render the table only when issues are loaded and there's no error
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Category</th>
                <th>Message</th>
                <th>Status</th>
                <th>Open Date</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td>{issue._id}</td>
                  <td>{issue.category?.name}</td> {/* Access category name */}
                  <td>{issue.issue_message}</td>
                  <td>{issue.issue_status}</td>
                  <td>{issue.open_date}</td>
                  <td>{issue.assignment_history[0]?.assigned_to?.name || "Not assigned yet"}</td>
                  {/* Access assigned user name */}
                  <td><Button variant="primary" size="sm" onClick={() =>
                        navigate(`/maintenance/dashboard/assign-issues/${issue._id}`)
                      }>Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default DisplayIssues;
