import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {FaBars, FaTimes, FaFilter, FaUser, FaChartBar, FaExclamationCircle} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const MaintenanceNavigationMenu = ({ onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasExample"
        style={{ width: "235px", position: "fixed", top: "0" }}
      >
        <div className="offcanvas-body">
          <nav className="nav flex-column mb-auto">
            <NavLink to="issues" className="nav-link">
              {" "}
              {/* Add a link to the issues component*/}
              <FaExclamationCircle className="me-2" /> Issues{" "}
              {/* Use the FaExclamationCircle icon*/}
            </NavLink>
            <NavLink to="assignments" className="nav-link">
              <FaUser className="me-2" /> Assignments
            </NavLink>
            <NavLink
              to="manage-categories"
              className="nav-link"
              aria-current="page"
            >
              <FaFilter className="me-2" /> Manage Categories
            </NavLink>
            <NavLink to="reports" className="nav-link">
              <FaChartBar className="me-2" /> Reports
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

export default MaintenanceNavigationMenu;
