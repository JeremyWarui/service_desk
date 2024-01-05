import React, { useState, useEffect } from "react";
import NavigationMenu from "./usersUtils/UserNavigation";
import MyIssuesList from "./usersUtils/MyIssuesList";
import ReportIssueForm from "./usersUtils/ReportNewIssue";
import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import {
  Row,
  Col,
  Spinner,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "react-bootstrap";

const UserDashboard = () => {
  // ... state variables and data fetching logic ...
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get("/issues");
        setIssues(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/issues");
      setIssues(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-dashboard container-fluid">
      <Row className="p-4">
        <Col md={3} className="sidebar">
          <NavigationMenu />
        </Col>
        <Col md={9} className="main-content">
          <Routes>
            <Route path="/" element={<>
              <h1 className="mb-4">My Dashboard</h1>
              {isLoading && <Spinner animation="border" />}
              {!isLoading && issues.length > 0 && (
                <Card className="mb-4">
                  <CardBody>
                    <CardTitle>My Issues</CardTitle>
                    <MyIssuesList issues={issues} onUpdate={fetchIssues} />
                  </CardBody>
                </Card>
              )}
              {!isLoading && issues.length === 0 && (
                <p>No issues found.</p>
              )}
            </>} />
            <Route path="post-issue" element={<>
              <Card className="mb-4">
                <CardBody>
                  <CardTitle>Report New Issue</CardTitle>
                  <ReportIssueForm onSuccess={fetchIssues} />
                </CardBody>
              </Card>
            </>
            }/>
          </Routes>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;




// import React from "react";
// import NavigationMenu from "./usersUtils/UserNavigation";
// import MyIssues from "./usersUtils/MyIssuesTab";
// import ReportIssueForm from "./usersUtils/ReportNewIssue";
// import { Routes, Route } from "react-router-dom";
// import { Row, Col } from "react-bootstrap";

// const UserDashboard = () => (
//   <div className="user-dashboard pt-5">
//     <Row>
//       <Col md={3} className="sidebar">
//         <NavigationMenu />
//       </Col>
//       <Col md={9} className="main-content">
//         <Routes>
//           <Route path="issues" element={<MyIssues />} />
//           <Route path="post-issue" element={<ReportIssueForm />} />
//           <Route path="my-issues" element={<MyIssues />} />
//         </Routes>
//       </Col>
//     </Row>
//   </div>
// );

// export default UserDashboard;