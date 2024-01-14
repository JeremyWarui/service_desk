// import React from "react";
// import { useAuth } from "./AuthContext";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ roles, redirectPath = "/login" }) => {
//   const { isAuthenticated, userRole, loading } = useAuth();

//   return (
//     // Handle loading state
//     loading ? (
//       <div>Loading...</div>
//     ) : // Check authentication and role requirements
//     isAuthenticated && (roles.length === 0 || roles.includes(userRole)) ? (
//       <Outlet />
//     ) : (
//       <Navigate to={redirectPath} replace />
//     )
//   );
// };

// export default ProtectedRoute;

// // import React, { useContext } from 'react';
// // import { Navigate, useParams } from 'react-router-dom';
// // import { getRedirectPathBasedOnRole, useAuth } from './AuthContext'; // Adjust path accordingly

// // // Protected route component
// // const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated, userRole, loading } = useAuth();
// // //   const { userId } = useParams();

// //   const redirectPath = getRedirectPathBasedOnRole(userRole);

// //   return loading ? (
// //     <div>Loading...</div>
// //   ) : isAuthenticated ? (
// //     children
// //   ) : (
// //     <Navigate to={redirectPath} replace />
// //   );
// // };

// // export default ProtectedRoute;
