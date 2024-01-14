import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaFilter,
  FaUserCog,
  FaChartBar,
  FaWrench,
  FaExclamationCircle,
  FaClipboardList,
} from "react-icons/fa";
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
        <nav className="nav flex-column mb-auto mt-5">
          <NavLink to="assignments" className="nav-link mt-3">
            <FaWrench className="me-2" /> Tasks
          </NavLink>
          <NavLink to="issues" className="nav-link mt-3">
            <FaExclamationCircle className="me-2" /> Attention Needed
          </NavLink>
          <NavLink to="not-assigned" className="nav-link mt-3">
            <FaClipboardList className="me-2" /> Pending Action
          </NavLink>
          <NavLink to="manage-categories" className="nav-link mt-3" aria-current="page">
            <FaFilter className="me-2" /> Organize
          </NavLink>
          <NavLink to="reports" className="nav-link mt-3">
            <FaChartBar className="me-2" /> Insights
          </NavLink>
          <NavLink to="user-settings" className="nav-link mt-3">
            <FaUserCog className="me-2" /> Settings
          </NavLink>
        </nav>
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
