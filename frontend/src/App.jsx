// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/usersComponent/userDashboard";
import TechnicianDashboard from "./components/techniciansComponent/technicianDashboard";
import MaintenanceDashboard from "./components/maintenanceComponent/maintenanceDashboard";
import Homepage from "./components/homepage";
import SignUpPage from "./components/services/registerUser";
import LoginPage from "./components/services/loginUser";

// import { TechnicianProvider } from "./components/techniciansComponent/techContext/AuthContext";
// import { AuthProvider } from "./components/usersComponent/userContext/AuthContext";

// import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthContext";
// import Cookies from "js-cookie";

// import { useAuth } from "./components/auth/AuthContext";
// const initialToken = Cookies.get("token");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
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
// <AuthProvider token={initialToken}>
//  <BrowserRouter>
//  <Routes>
//    <Route path="/" element={<Homepage />} />
//    <Route path="/login" element={<LoginPage />} />
//    <Route path="/signup" element={<SignUpPage />} />
//    <Route path="/maintenance-dashboard/" element={<ProtectedRoute roles={["maintenance_officer"]} />}>
//      <Route index element={<MaintenanceDashboard />} />
//    </Route>
//    <Route path="/technicians-dashboard/*" element={<ProtectedRoute roles={["technician"]} />}>
//      <Route index element={<TechnicianDashboard />} />
//    </Route>
//    <Route path="/users-dashboard/" element={<ProtectedRoute roles={["user"]} />}>
//      <Route index element={<UserDashboard />} />
//    </Route>
//  </Routes>
// </BrowserRouter>
// </AuthProvider>
