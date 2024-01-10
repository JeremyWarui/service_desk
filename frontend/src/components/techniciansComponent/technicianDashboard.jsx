import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";

import AssignedIssues from "./technicianUtils/techAssignments";
import TechnicianNavigationMenu from "../techniciansComponent/technicianUtils/navigationBar";
import TechAssignmentDetails from "./technicianUtils/techAssignmentDetails";
import PendingAssignments from "./technicianUtils/pendingIssues";
import ResolvedAssignments from "../techniciansComponent/technicianUtils/resolvedIssues";
import ResolvedAssignmentDetails from "./technicianUtils/techDetailsResolved";

export const DataContext = React.createContext();

const TechnicianDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigned-issues");
  const [data, setData] = useState(null);

  const technicianId = "657c5a4e6bef093354653d28";
  async function fetchData() {
    const response = await axios(`http://localhost:5000/techAssignments/${technicianId}`);
    const data = response.data.assignments;
    return data;
  }
 
  useEffect(() => {
    async function fetchAndSetData() {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAndSetData();
  }, []);

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <>
      <Container fluid>
        <Row>
          {/* Navigation menu */}
          <Col sm={3} className="bg-light" style={{ height: "100vh" }}>
            {/* Use the DataContext.Provider component to provide the data to the TechnicianNavigationMenu component */}
            <DataContext.Provider value={data}>
              <TechnicianNavigationMenu />
            </DataContext.Provider>
          </Col>
          {/* Main content area */}
          <Col sm={9}>
            <Routes>
              <Route path="*" element={<Navigate to="assigned-issues" />} />
              <Route path="assigned-issues" element={<AssignedIssues data={data} />} />
              <Route path="assignments-details/:id" element={<TechAssignmentDetails />} />
              <Route path="pending-issues" element={<PendingAssignments />} />
              <Route path="resolved-issues" element={<ResolvedAssignments />} />
              <Route path="resolved-details" element={<ResolvedAssignmentDetails />} />
              {/* <Route path="/account-settings" element={<AccountSettings />} /> */}
              <Route path="*" element={<p>404 Not Found</p>} />
              {/* use element prop and pass the component as a JSX element*/}
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default TechnicianDashboard;
