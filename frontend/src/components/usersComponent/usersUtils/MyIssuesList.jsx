import React, { useState, useEffect } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import axios from "axios";

const MyIssues = ({ userId, categoryId }) => {
  // Accept user/category IDs as props
  const [issues, setIssues] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        let response;
        if (userId) {
          response = await axios.get(`/users/${userId}/issues`); // Fetch by user
        } else if (categoryId) {
          response = await axios.get(`/categories/${categoryId}/issues`); // Fetch by category
        } else {
          response = await axios.get("/issues"); // Fetch all issues
        }
        setIssues(response.data.issues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, [userId, categoryId]); // Refetch if user/category IDs change
  const handleSort = (column) => {
    setSortBy(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedIssues = issues.slice().sort((a, b) => {
    if (!sortBy) return 0;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    return 0;
  });

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>
            <Button variant="link" onClick={() => handleSort("title")}>
              Title {sortBy === "title" && <Badge>{sortOrder}</Badge>}
            </Button>
          </th>
          <th>
            <Button variant="link" onClick={() => handleSort("category")}>
              Category {sortBy === "category" && <Badge>{sortOrder}</Badge>}
            </Button>
          </th>
          <th>Status</th>
          <th>Date Reported</th>
          <th>Assigned Technician</th>
        </tr>
      </thead>
      <tbody>
        {sortedIssues.map((issue) => (
          <tr key={issue.id}>
            <td>{issue.title}</td>
            <td>{issue.category}</td>
            <td>
              <span
                className={`text-${
                  issue.status.toLowerCase() === "open" ? "danger" : "success"
                }`}
              >
                {issue.status}
              </span>
            </td>
            <td>{issue.dateReported}</td>
            <td>
              {issue.assignedTechnician ? issue.assignedTechnician.name : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MyIssues;
