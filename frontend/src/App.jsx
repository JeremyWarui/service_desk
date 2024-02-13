// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./components/usersComponent/userDashboard";
import TechnicianDashboard from "./components/techniciansComponent/technicianDashboard";
import MaintenanceDashboard from "./components/maintenanceComponent/maintenanceDashboard";
import Homepage from "./components/homepage";
import SignUpPage from "./components/services/registerUser";
import LoginPage from "./components/services/loginUser";

import { AuthProvider } from "./components/auth/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/home" element={<Homepage />} />
        <Route
          path="/login"
          element={
            <AuthProvider>
              <LoginPage />
            </AuthProvider>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/maintenance-dashboard/*"
          element={
            <AuthProvider>
              <MaintenanceDashboard />
            </AuthProvider>
          }
        />
        <Route
          path="/technicians-dashboard/*"
          element={
            <AuthProvider>
              <TechnicianDashboard />
            </AuthProvider>
          }
        />
        <Route
          path="/users-dashboard/*"
          element={
            <AuthProvider>
              <UserDashboard />
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
