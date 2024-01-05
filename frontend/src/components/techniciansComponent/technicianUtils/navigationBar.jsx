import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaFilter, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const TechnicianNavigationMenu = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Automatically open sidebar on larger screens (optional)
    if (window.innerWidth > 768) {
      setSidebarOpen(true);
    }
  }, []);

  // Get open issue counts for badges (replace with actual logic)
  const assignedIssueCount = 5;
  const pendingIssueCount = 2;
  const resolvedIssueCount = 0;

  return (
    <>
      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? "show" : ""}`}
        tabindex="-1"
        id="offcanvasExample"
        style={{ width: "320px" }}
      >
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
        <div className="offcanvas-body">
          <nav className="nav flex-column mb-auto">
            <NavLink
              to="assigned-issues"
              className="nav-link"
              aria-current="page"
            >
              <FaFilter className="me-2" /> Assigned Issues
              {assignedIssueCount > 0 && (
                <span className="badge bg-danger ms-2">{assignedIssueCount}</span>
              )}
            </NavLink>
            <NavLink
              to="pending-issues"
              className="nav-link"
              aria-current="page"
            >
              <FaFilter className="me-2" /> Pending Issues
              {pendingIssueCount > 0 && (
                <span className="badge bg-danger ms-2">{pendingIssueCount}</span>
              )}
            </NavLink>
            <NavLink
              to="resolved-issues"
              className="nav-link"
              aria-current="page"
            >
              <FaFilter className="me-2" /> Resolved Issues
              {resolvedIssueCount > 0 && (
                <span className="badge bg-danger ms-2">{resolvedIssueCount}</span>
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
