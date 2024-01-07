import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const DisplayIssues = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/issues");
        const data = response.data;

        // Fetch category and technician data concurrently
        const promises = data.issues.map((issue) =>
          Promise.all([
            axios.get(`http://localhost:5000/categories/${issue.category._id}`), // Use category instead of category_id
            issue.assignment_history && issue.assignment_history[0]
              ? axios.get(
                  `http://localhost:5000/users/${issue.assignment_history[0].assigned_to}`
                )
              : Promise.resolve(null),
          ])
        );

        const issuesWithDetails = await Promise.all(promises);

        const updatedIssues = data.issues.map((issue, index) => ({
          ...issue,
          category:
            issuesWithDetails[index][0]?.data?.category?.category_name ?? null, // Use category instead of category_id
          technician:
            issuesWithDetails[index][1]?.data?.user_name ?? "Not yet assigned",
        }));
        // const unassigned = updatedIssues.filter((issue) => issue.technician === "Not yet assigned");
        setIssues(updatedIssues);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  return (
    <>
      <div>
        <h1 className="py-3">Maintenance Issues</h1>
        <hr></hr>
        {isLoading ? (
          <p>Loading issues...</p>
        ) : (
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
                  <td>{issue.category}</td>
                  <td>{issue.issue_message}</td>
                  <td>{issue.issue_status}</td>
                  <td>{moment(issue.open_date).format("DD/MM/YYYY")}</td>
                  <td>{issue.technician}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/maintenance/dashboard/assign-issues/${issue._id}`,
                          { state: { issue } }
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
        )}
      </div>
    </>
  );
};

export default DisplayIssues;
