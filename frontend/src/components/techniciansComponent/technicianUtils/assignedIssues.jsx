import React, { useState } from "react";
import {
  Modal,
  Button,
  Card,
  Badge,
  ButtonGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

const AssignedIssuesCard = ({ issue }) => {
  const getCategoryColor = (category) => {
    // Map your categories to specific Bootstrap color variants here
    return "primary";
  };

  const handleStatusChange = (newStatus) => {
    // Implement your logic to update issue status on change
    console.log("Updating status to", newStatus);
  };

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleOpenDetailsModal = () => setShowDetailsModal(true);
  const handleCloseDetailsModal = () => setShowDetailsModal(false);

  return (
    <>
      <Card>
        <Card.Header>
          <h2>{issue.title}</h2>
          <Badge variant={getCategoryColor(issue.category)}>
            {issue.category}
          </Badge>
          <text muted>{issue.status}</text>
        </Card.Header>
        <Card.Body>
          {/*use Card.Body instead of CardBody */}
          <text>Reported on: {issue.dateReported}</text>
          <text>Reported by: {issue.reportedBy.name}</text>
          <ButtonGroup className="ms-2">
            <Button variant="primary" onClick={handleOpenDetailsModal}>
              View Details
            </Button>
            <DropdownButton
              title="Update Status"
              id="status-dropdown"
              onSelect={handleStatusChange}
            >
              <Dropdown.Item eventKey="Open">Open</Dropdown.Item>
              <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
              <Dropdown.Item eventKey="Closed">Closed</Dropdown.Item>
            </DropdownButton>
            <Button variant="info" onClick={() => console.log("Send Message")}>
              Send Message
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>{issue.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your issue details here, like full description, communication history, etc. */}
          <text>Description: {issue.description}</text>
          <text>Communication History:</text>
          {/* Implement logic to display messages sent and received */}
          {/* Replace this with actual message components */}
          <text>No communication history yet.</text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AssignedIssues = ({ issues }) => {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {issues.map((issue) => (
        <AssignedIssuesCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

export default AssignedIssues;
