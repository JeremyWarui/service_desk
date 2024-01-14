import React, { useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./userContext/AuthContext"; // Import AuthContext

// Import necessary components
import ReportIssueForm from "./usersUtils/ReportNewIssue";
import MyIssues from "./usersUtils/MyIssuesList";
import AllIssues from "./usersUtils/AllIssues";
import IssueDetails from "./usersUtils/IssueDetails";
import UserNavigationMenu from "./usersUtils/UserNavigation";

// UserDashboard.js
const UserDashboard = () => {
  // const { userRole, token } = useAuth();
  const { user } = useContext(AuthContext);
  console.log(user);
  const [activeTab, setActiveTab] = useState("all-issues");
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Container fluid>
        <Row>
          {/* Navigation menu */}
          <Col sm={2} className="bg-light" style={{ height: "100%" }}>
            {/* <UserNavigationMenu /> */}
            <UserNavigationMenu onTabChange={handleTabChange} />
          </Col>
          {/* Main content area */}
          <Col sm={10}>
            <Routes>
              <Route
                path="*" element={
                  <Col sm={7}>
                    <Navigate to="all-issues" replace />
                  </Col>
                }
              />
              <Route path="report-issue" element={<ReportIssueForm />} />
              <Route path="my-issues" element={<MyIssues />} />
              <Route path="all-issues" element={<AllIssues />} />
              <Route path="issue-details/:id" element={<IssueDetails />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserDashboard;
