import React, { useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./usersUtils/userContext/AuthContext"; // Import AuthContext

// Import necessary components
import ReportIssueForm from "./usersUtils/IssuesServices/ReportNewIssue";
import MyIssues from "./usersUtils/IssuesServices/MyIssuesList";
import AllIssues from "./usersUtils/IssuesServices/AllIssues";
import IssueDetails from "./usersUtils/IssuesServices/IssueDetails";
import UserNavigationMenu from "./usersUtils/IssuesServices/UserNavigation";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("all-issues");
    const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {user && user.user_role === "user" ? (
        <>
          <Container fluid>
            <Row>
              {/* Navigation menu */}
              <Col sm={2} className="bg-light" style={{ height: "100%" }}>
                <UserNavigationMenu onTabChange={handleTabChange} />
              </Col>
              {/* Main content area */}
              <Col sm={10}>
                <Routes>
                  {/* Redirect to "all-issues" for default route */}
                  <Route path="*" element={ <Col sm={7}> <Navigate to="all-issues" replace /></Col>} />
                  <Route path="report-issue" element={<ReportIssueForm />} />
                  <Route path="my-issues" element={<MyIssues />} />
                  <Route path="all-issues" element={<AllIssues />} />
                  <Route path="issue-details/:id" element={<IssueDetails />} />
                </Routes>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <div>Unauthorized access</div>
      )}
    </>
  );
};

export default UserDashboard;
