import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import moment from "moment";

const ResolvedAssignmentDetails = () => {
  const [resolvedAssignment, setResolvedAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  console.log(id);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/assignments/${id}`);
      setResolvedAssignment(response.data.assignment);
    } catch (error) {
      setError("Error fetching assignment details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // console.log(resolvedAssignment);
  }, [id]);

  // Define a function to handle the retry button click
  const handleRetry = () => {
    setError(null);
    fetchData();
  };

  // Return a JSX element that renders a card with the details of the resolved assignment
  return (
    <div className="container">
      {loading && <p className="loading-message">Loading resolved assignment details...</p>}
      {error && (
        <div className="error-message">
          {error} <button onClick={() => handleRetry()}>Retry</button>
        </div>
      )}
      {resolvedAssignment && (
        <Row>
          <Col>
            <Card bg="light" border="primary" text="dark">
              <Card.Header>Issue ID: {resolvedAssignment.id}</Card.Header>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Category</td>
                    <td>{resolvedAssignment.category}</td>
                  </tr>
                  <tr>
                    <td>Message</td>
                    <td>{resolvedAssignment.issue}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{resolvedAssignment.status}</td>
                  </tr>
                  <tr>
                    <td>Priority</td>
                    <td>
                      {resolvedAssignment.priority === 1 ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          High
                        </span>
                      ) : resolvedAssignment.priority === 2 ? (
                        <span style={{ color: "orange", fontWeight: "bold" }}>
                          Medium
                        </span>
                      ) : (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          Low
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Reported Date</td>
                    <td>{moment(resolvedAssignment.issue.createdAt).format("DD/MM/YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Assigned To</td>
                    <td>{resolvedAssignment.technician}</td>
                  </tr>
                  <tr>
                    <td>Assigned Date</td>
                    <td>{moment(resolvedAssignment.assigned_date).format("DD/MM/YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Deadline</td>
                    <td>{moment(resolvedAssignment.deadline).format("DD/MM/YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Resolved Date</td>
                    <td>{moment(resolvedAssignment.resolved_date).format("DD/MM/YYYY")}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
            <h3>Messages: {resolvedAssignment.messages.length} messages</h3>
            {resolvedAssignment.messages.map((message) => (
            <Card message={message} className="mb-3 border">
              <Card.Body>
                <Card.Title>{message.sender.user_name}</Card.Title>
                <Card.Text>{message.message}</Card.Text>
                <Card.Text>Sent on: {message.sent_date}</Card.Text>
              </Card.Body>
            </Card>
          ))}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ResolvedAssignmentDetails;