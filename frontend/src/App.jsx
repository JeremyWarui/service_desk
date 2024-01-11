// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/usersComponent/userDashboard";
import TechnicianDashboard from "./components/techniciansComponent/technicianDashboard";
import MaintenanceDashboard from "./components/maintenanceComponent/maintenanceDashboard";
import Homepage from "./components/homepage";
import { AuthProvider } from "./components/usersComponent/usersUtils/userContext/AuthContext"; // Import AuthProvider

function App() {
  return (
    <Router>
      {/* Other routes for different user roles or functionalities */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route element={<AuthProvider>
          <UserDashboard />
        </AuthProvider>}
        path="/users/dashboard/*"
        />
        <Route
          path="/technicians/dashboard/*"
          element={<TechnicianDashboard />}
        />
        <Route path="/maintenance/dashboard/*" element={<MaintenanceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
