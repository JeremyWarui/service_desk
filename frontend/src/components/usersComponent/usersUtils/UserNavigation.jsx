import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaFilter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const NavigationMenu = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      // Consider removing this automatic opening on larger screens
      // as it might not be ideal for all users.
      // if (window.innerWidth > 768) {
      //   setSidebarOpen(true);
      // } else {
      //   setSidebarOpen(false);
      // }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasExample"
        style={{ width: "220px" }}
      >
        <div className="offcanvas-body">
          <div className="d-flex">
            <h2 className="mb-4">Welcome</h2>
          </div>
          <nav className="nav flex-column mb-auto">
            <NavLink
              to="all-issues"
              className="nav-link"
              aria-current="page" // Active link logic handled by React Router
            >
              <FaHome className="me-2" /> All Issues
            </NavLink>
            <NavLink to="report-issue" className="nav-link">
              <FaFilter className="me-2" /> Post New Issue
            </NavLink>
            <NavLink to="my-issues" className="nav-link">
              <FaFilter className="me-2" /> My Issues
            </NavLink>
            {/* Add additional tabs as needed */}
          </nav>
          <hr />
          <div className="d-flex">
            <NavLink to="account-settings" className="btn btn-primary btn-sm">
              Account Settings
            </NavLink>
          </div>
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

export default NavigationMenu;
