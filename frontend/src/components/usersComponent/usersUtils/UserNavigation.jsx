import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaFilter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const NavigationMenu = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              to="post-issue"
              className="nav-link"
              aria-current="page" // Active link logic handled by React Router
            >
              <FaHome className="me-2" /> Report New Issue
            </NavLink>
            <NavLink to="my-issues" className="nav-link">
              <FaFilter className="me-2" /> Open Issues
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
