import React from "react";
import { Card, Badge } from "react-bootstrap";

const ResolvedIssues = ({ resolvedIssues }) => {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {resolvedIssues.map((issue) => (
        <Card key={issue.id}>
          <Card.Header>
            <h2>{issue.title}</h2>
            <Badge variant="success">Resolved</Badge>
          </Card.Header>
          <Card.Body>
            <text>Resolved on: {issue.resolvedDate}</text>
            <text>Reported by: {issue.reportedBy.name}</text>
            {/* Add additional information related to resolved issues, like resolution details or assignee, if needed */}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ResolvedIssues;
