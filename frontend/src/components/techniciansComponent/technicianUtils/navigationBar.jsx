import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaFilter, FaUser } from "react-icons/fa";
import { useContext, useMemo } from "react";
import { Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataContext } from "../technicianDashboard";

const TechnicianNavigationMenu = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    // Automatically open sidebar on larger screens (optional)
    if (window.innerWidth > 768) {
      setSidebarOpen(true);
    }
  }, []);
  const data = useContext(DataContext);
  const openIssueCount = useMemo(() => {
    return data ? data.length : 0;
  }, [data]);
  const pendingIssues = data ? data.filter(issue => issue.status === "pending" || issue.status === "in-progress") : [];
  const resolvedIssues = data ? data.filter(issue => issue.status === "resolved") : [];
  const pendingIssueCount = pendingIssues.length;
  const resolvedIssueCount = resolvedIssues.length;

  return (
    <>
      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasExample"
        style={{ width: "320px" }}
      >
        <div className="offcanvas-body">
          <nav className="nav flex-column mb-auto">
            <NavLink
              to="assigned-issues"
              className="nav-link"
              aria-current="page"
            >
              <FaFilter className="me-2" /> Assigned Issues
              {/* Use the Badge component from React Bootstrap to create the badges that display the open issue count data */}
              {openIssueCount > 0 && (
                <Badge variant="danger" bg="danger" pill className="ms-2">
                  {openIssueCount}
                </Badge>
              )}
            </NavLink>
            <NavLink
              to="pending-issues"
              className="nav-link"
              aria-current="page"
            >
              <FaFilter className="me-2" /> Pending Issues
              {pendingIssueCount > 0 && (
                <Badge variant="danger" bg="danger" pill className="ms-2">
                  {pendingIssueCount}
                </Badge>
              )}
            </NavLink>
            <NavLink
              to="resolved-issues"
              className="nav-link"
              aria-current="page"
            >
              <FaFilter className="me-2" /> Resolved Issues
              {resolvedIssueCount > 0 && (
                <Badge variant="danger" bg="danger" pill className="ms-2">
                  {resolvedIssueCount}
                </Badge>
              )}
            </NavLink>
            <NavLink to="categories" className="nav-link">
              <FaFilter className="me-2" /> Categories
            </NavLink>
            <NavLink to="account-settings" className="nav-link">
              <FaUser className="me-2" /> Account Settings
            </NavLink>
          </nav>
          <hr />
        </div>
      </div>
      <button
        className="navbar-toggler btn btn-dark btn-sm"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
    </>
  );
};

export default TechnicianNavigationMenu;
