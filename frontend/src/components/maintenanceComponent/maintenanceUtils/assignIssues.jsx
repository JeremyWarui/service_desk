import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import axios from "axios";

const AssignIssues = () => {
  const [issues, setIssues] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignedTechnicians, setAssignedTechnicians] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams(); // Use the useParams hook to get the id parameter
  const navigate = useNavigate(); // Use the useNavigate hook

  // Wrap the fetchData function in a useCallback hook
  const fetchData = useCallback(async () => {
    try {
      // Fix the template literal syntax
      const issuesResponse = await axios.get(`http://localhost:5000/issues/${id}`);
      const issuesData = issuesResponse.data;
      console.log(issuesData);
      const techniciansResponse = await axios.get("/api/technicians");
      const techniciansData = techniciansResponse.data;
      setIssues(issuesData);
      setTechnicians(techniciansData);
      setAssignedTechnicians(
        issuesData.reduce(
          (acc, issue) => ({ ...acc, [issue._id]: issue.technician || null }),
          {}
        )
      ); // Pre-fill with existing assignments
      //populate the user aand category
      // eslint-disable-next-line no-undef
      const issues = await Issues.find({}).populate('user').populate('category');
      // eslint-disable-next-line no-undef
      return res.status(200).json({issues}); 

    } catch (error) {
      // Handle the error here
      console.error(error);
      setError(error);
    }
  }, [id]); // Add any dependencies of fetchData here

  useEffect(() => {
    // Fetch issues and technicians from your data source
    fetchData();
  }, [id, fetchData]); // Add id and fetchData as dependencies

  const handleTechnicianChange = (event) => {
    const issueId = event.target.name;
    const technicianId = event.target.value;
    setAssignedTechnicians({ ...assignedTechnicians, [issueId]: technicianId });
  };

  const confirmAssignments = async () => {
    // Send updated assignments to your API
    try {
      await axios.put("/api/issues/assign-technicians", assignedTechnicians);
      // Handle successful response (e.g., display a success message)
      console.log("Assignments updated successfully");
      // You might want to display a success message to the user here
      setAssignedTechnicians({}); // Clear the assignments
      fetchData(); // Refresh the issues to reflect the changes
      navigate("/issues"); // Navigate back to the issues page
    } catch (error) {
      // Handle error (e.g., display an error message)
      console.error("Error updating assignments:", error);
      // You might want to display an error message to the user here
    }
  };

  return (
    <div>
      <h2>Assign Issues</h2>
      {error && <p className="error">Something went wrong: {error.message}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Date Reported</th>
            <th>User</th>
            <th>Assign Technician</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td>{issue.category.name}</td> {/* Display the category name */}
              <td>{issue.open_date}</td>
              <td>{issue.user.name}</td> {/* Display the user name */}
              <td>
                <Form.Select
                  name={issue._id}
                  value={assignedTechnicians[issue._id]}
                  onChange={handleTechnicianChange}
                >
                  <option value="">Select Technician</option>
                  {technicians.map((technician) => (
                    <option key={technician._id} value={technician._id}>
                      {technician.name}
                    </option>
                  ))}
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={confirmAssignments}>
        Confirm Assignments
      </Button>
    </div>
  );
};

export default AssignIssues;
