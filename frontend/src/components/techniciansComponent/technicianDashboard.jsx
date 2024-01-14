import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
// import axios from "axios";

import { TechnicianContext } from "./techContext/AuthContext";

import MyAssignments from "./technicianUtils/MyAssignments";
import TechnicianNavigationMenu from "./technicianUtils/TechNavBar";
import UpdateAssignments from "./technicianUtils/UpdateMyAssignment";
import PendingAssignments from "./technicianUtils/PendingAssignments";
import ResolvedAssignments from "./technicianUtils/ResolvedIssues";
import ResolvedAssignmentDetails from "./technicianUtils/ViewResolved";

// export const DataContext = React.createContext();

const TechnicianDashboard = () => {
  const { technician } = useContext(TechnicianContext);

  return (
    <>
      {technician && technician.user_role === "technician" ? (
        <Container fluid>
          <Row className="mt-3">
            {/* Navigation menu */}
            <Col sm={2} className="bg-light" style={{ height: "100vh" }}>
              <TechnicianNavigationMenu />
            </Col>
            {/* Main content area */}
            <Col sm={10}>
              <Routes>
                <Route path="*" element={<Navigate to="assigned-issues" />} />
                <Route path="assigned-issues" element={<MyAssignments />} />
                <Route
                  path="assignment-details/:id"
                  element={<UpdateAssignments />}
                />
                <Route path="pending-issues" element={<PendingAssignments />} />
                <Route
                  path="resolved-issues"
                  element={<ResolvedAssignments />}
                />
                <Route
                  path="resolved-details/:id"
                  element={<ResolvedAssignmentDetails />}
                />
                {/* <Route path="/account-settings" element={<AccountSettings />} /> */}
                <Route path="*" element={<p>404 Not Found</p>} />
                {/* use element prop and pass the component as a JSX element*/}
              </Routes>
            </Col>
          </Row>
        </Container>
      ) : (
        <div>Unauthorized access</div>
      )}
    </>
  );
};
export default TechnicianDashboard;
