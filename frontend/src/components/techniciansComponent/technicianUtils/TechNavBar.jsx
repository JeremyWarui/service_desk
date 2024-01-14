import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaFilter,
  FaTasks,
  FaClock,
  FaCheck,
  FaCog,
} from "react-icons/fa";
import { Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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

  return (
    <>
      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasExample"
        style={{ width: "240px" }}
      >
        <div className="offcanvas-body">
          <nav className="nav flex-column mb-auto mt-5">
            <NavLink
              to="my-issues"
              className="nav-link my-2"
              aria-current="page"
            >
              <FaTasks className="me-2" /> My Tasks
              {/* Display badges with issue counts as needed */}
            </NavLink>
            <NavLink
              to="pending-issues"
              className="nav-link my-2"
              aria-current="page"
            >
              <FaClock className="me-2" /> Pending Issues
              {/* Display badges with issue counts as needed */}
            </NavLink>
            <NavLink
              to="resolved-issues"
              className="nav-link my-2"
              aria-current="page"
            >
              <FaCheck className="me-2" /> Resolved Issues
              {/* Display badges with issue counts as needed */}
            </NavLink>
            <NavLink to="categories" className="nav-link my-2">
              <FaFilter className="me-2" /> Categories
            </NavLink>
            <NavLink to="account-settings" className="nav-link my-2">
              <FaCog className="me-2" /> Account Settings
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
