import React, { useState, useEffect } from "react";
import { Spinner, Card, Table, Button , Row, Col} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import moment from "moment";

const IssueDetails = () => { // Remove match prop
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newIssueMessage, setNewIssueMessage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/issues/${id}`); // Use id from params
        console.log(response.data);
        setIssue(response?.data.issue);
        setNewIssueMessage(response.data.issue.issue_message); // Initialize with current message
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssue();
  }, [id]); // Use id from params as dependency

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/issues/${id}`, { // Use id from params
        issue_message: newIssueMessage,
      });
      navigate("/users-dashboard/my-issues");
    } catch (error) {
      // Handle update error
      console.error(error);
      setError("Failed to update issue. Please try again.");
    }
  };
  function handleClick() {
    navigate("/users-dashboard/my-issues");
  }

  return (
    <div>
      {isLoading && <Spinner animation="border" />}
      {error && <div>{error.message}</div>}
      {id && !isLoading && !error && ( // Use id from params
        <Card className="mt-3">
          <Card.Header>
            <h2>Issue Details</h2>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Issue ID</td>
                  <td>{issue.issue_id}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{issue.category}</td>
                </tr>
                <tr>
                  <td>Issue Message</td>
                  <td>{issue.issue.issue_message}</td>
                </tr>
                <tr>
                  <td>Reported By</td>
                  <td>{issue.raiseeName}</td>
                </tr>
                <tr>
                  <td>Reported On</td>
                  <td>{moment(issue.createdAt).format("DD/MM/YYYY")}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{issue.status}</td>
                </tr>
                <tr>
                  <td>Assigned to</td>
                  <td>{issue.assignedTechnician}</td>
                </tr>
                
                <tr>
                  <td>Updated At</td>
                  <td>{moment(issue.updateDate).format("DD/MM/YYYY")}</td>
                </tr>
              </tbody>
            </Table>
            <hr />
            <h3>Edit Issue Message</h3>
            <form onSubmit={handleEditSubmit}>
              <textarea
                value={newIssueMessage}
                onChange={(e) => setNewIssueMessage(e.target.value)}
                className="form-control"
                rows="5"
              />
              <br />
              <Row>
                <Col><button type="submit" className="btn btn-primary">
                Save Changes
              </button></Col>
                <Col><Button variant="secondary" onClick={handleClick}>
                Go Back
              </Button></Col>
              </Row>
              
            </form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default IssueDetails;
