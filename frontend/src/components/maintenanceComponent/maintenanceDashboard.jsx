import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";

import ManageCategories from "./maintenanceUtils/manageCategories";
import AssignIssues from "./maintenanceUtils/assignIssues";
// import Reports from "./maintenanceUtils/Reports";
// import AccountSettings from "./maintenanceUtils/AccountSettings";
import MaintenanceNavigationMenu from "./maintenanceUtils/navigationBar";
import DisplayIssues from "./maintenanceUtils/displayIssues"; // Import the issues component

const MaintenanceOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState("issues"); // Change the default active tab to issues

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    window.scrollTo(0, 0); // Scroll to top of the page when tab changes
  };

  return (
    <>
      <Container fluid>
        <Row>
          {/* Navigation menu */}
          <Col sm={2} className="bg-light" style={{ height: "100%"}}>
            <MaintenanceNavigationMenu onTabChange={handleTabChange} />
          </Col>
          {/* Main content area */}
          <Col sm={10}>
            <Routes>
              {/* Change the default route to redirect to the issues component*/}
              <Route path="*" element={<Navigate to="issues" />} />
              {/* Add a route for the issues component */}
              <Route path="issues" element={<DisplayIssues />} />{" "}
              <Route path="manage-categories" element={ <Col sm={9}> <ManageCategories /> </Col>} />
              <Route path="assign-issues" element={ <Col sm={10}> <AssignIssues /> </Col> } />
              <Route path="assign-issues/:id" element={ <Col sm={10}> <AssignIssues /> </Col> } />{" "}
              {/* Add a route for updating a specific issue*/}
              {/* <Route path="reports" element={<Reports />} /> */}
              {/* <Route path="account-settings" element={<AccountSettings />} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MaintenanceOfficerDashboard;
