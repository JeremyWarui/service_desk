// import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/usersComponent/userDashboard";
import TechnicianDashboard from "./components/techniciansComponent/technicianDashboard";
import MaintenanceDashboard from "./components/maintenanceComponent/maintenanceDashboard";
import Homepage from "./components/homepage";

function App() {
  return (
    <Router>
      {/* Other routes for different user roles or functionalities */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/users/dashboard/*" element={<UserDashboard />} />
        <Route
          path="/technicians/dashboard/*"
          element={<TechnicianDashboard />}
        />
        < Route path="/maintenance/dashboard/*" element={<MaintenanceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
