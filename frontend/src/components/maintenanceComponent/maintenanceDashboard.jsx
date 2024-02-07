import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";

import ManageCategories from "./maintenanceUtils/manageCategories";
import CreateAssignment from "./maintenanceUtils/CreateAssignment";
// import Reports from "./maintenanceUtils/Reports";
// import AccountSettings from "./maintenanceUtils/AccountSettings";
import MaintenanceNavigationMenu from "./maintenanceUtils/MaintenanceNavBar";
import Assignments from "./maintenanceUtils/Assignments";
import ViewAllIssues from "./maintenanceUtils/ViewAllIssues";
import UnassignedIssues from "./maintenanceUtils/UnAssignedIssues";
import UpdateAssignment from "./maintenanceUtils/UpdateAssignments";

import { useAuth } from "../auth/AuthContext";

const MaintenanceOfficerDashboard = () => {
  const { user } = useAuth();

  // Use user information as needed
  // console.log("User ID:", user?._id);
  // console.log("User Role:", user?.user_role);

  const [activeTab, setActiveTab] = useState("issues"); // Change the default active tab to issues

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    window.scrollTo(0, 0); // Scroll to top of the page when tab changes
  };

  return (
    <>
      {user && user.user_role === "maintenance_officer" ? (
        <Container fluid>
          <Row>
            {/* Navigation menu */}
            <Col sm={2} className="bg-light" style={{ height: "100%" }}>
              <MaintenanceNavigationMenu onTabChange={handleTabChange} />
            </Col>
            {/* Main content area */}
            <Col sm={10}>
              <Routes>
                <Route path="*" element={<Navigate to="assignments" />} />
                <Route path="issues" element={<ViewAllIssues />} />{" "}
                <Route path="not-assigned" element={<UnassignedIssues />} />{" "}
                <Route path="assignments" element={<Assignments />} />
                <Route path="assignments/:id" element={<UpdateAssignment />} />
                <Route
                  path="manage-categories"
                  element={
                    <Col sm={9}>
                      {" "}
                      <ManageCategories />{" "}
                    </Col>
                  }
                />
                {/* <Route path="assign-issues" element={ <Col sm={10}> <CreateAssignment /> </Col> } /> */}
                <Route
                  path="assign-issues/:id"
                  element={
                    <Col sm={10}>
                      {" "}
                      <CreateAssignment />{" "}
                    </Col>
                  }
                />{" "}
                {/* Add a route for updating a specific issue*/}
                {/* <Route path="reports" element={<Reports />} /> */}
                {/* <Route path="account-settings" element={<AccountSettings />} /> */}
              </Routes>
            </Col>
          </Row>
        </Container>
      ) : (
        // Redirect to the login page if the user is not defined
        <Navigate to="/login" />
      )}
    </>
  );
};

export default MaintenanceOfficerDashboard;
