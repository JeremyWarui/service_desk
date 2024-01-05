import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import AssignedIssues from "../techniciansComponent/technicianUtils/assignedIssues";
// import PendingIssues from "../technicianComponent/technicianUtils/pendingIssues";
import ResolvedIssues from "../techniciansComponent/technicianUtils/resolvedIssues";
import TechnicianNavigationMenu from "../techniciansComponent/technicianUtils/navigationBar";

const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigned-issues");

  // Get open issue count from your data source (replace with actual logic)
  const getOpenIssueCount = () => {
    // Your logic to fetch open issue count
    return Promise.resolve(5); // This is just an example, replace with actual
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <>
      <Container fluid>
        <Row>
          {/* Navigation menu */}
          <Col sm={3} className="bg-light" style={{ height: "100vh" }}>
            <TechnicianNavigationMenu
              // Pass handleTabChange and open issue count logic
              onTabChange={handleTabChange}
              getOpenIssueCount={getOpenIssueCount}
            />
          </Col>
          {/* Main content area */}
          <Col sm={9}>
            <Routes>
              <Route path="assigned-issues" element={<AssignedIssues />} />
              {/* use element prop and pass the component as a JSX element*/}
              {/* <Route path="pending-issues" element={<PendingIssues />} /> */}
              {/* use element prop and pass the component as a JSX element*/}
              <Route path="resolved-issues" element={<ResolvedIssues />} />
              {/* use element prop and pass the component as a JSX element*/}
              {/* <Route path="/account-settings" element={<AccountSettings />} /> */}
              <Route path="*" element={<p>404 Not Found</p>} />
              {/* use element prop and pass the component as a JSX element*/}
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TechnicianDashboard;
