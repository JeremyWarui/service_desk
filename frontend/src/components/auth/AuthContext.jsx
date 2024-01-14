// // authContext.jsx
// import React, { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";

// // Create a new context object
// export const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const getRedirectPathBasedOnRole = (userRole) => {
//   const paths = {
//     maintenance_officer: "/maintenance-dashboard/*",
//     user: "/users-dashboard/",
//     technician: "/technicians-dashboard/*",
//     admin: "/",
//   };
//   console.log(userRole);
//   return (paths[userRole] ?  paths[userRole] : "/login"); // Handle unknown roles
// };

// export const AuthProvider = ({ children }) => {
//   // Define the state and functions related to authentication
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState("");
//   const [token, setToken] = useState("");
//   const [loading, setLoading] = useState(false); 
//   // const navigate = useNavigate();

//   const signup = async (name, email, password, role, category) => {
//     // Handle the sign up logic here
//     try {
//       const newUser = {
//         user_name: name,
//         email: email,
//         password: password,
//         user_role: role,
//         category: category,
//       };
//       const response = await axios.post(
//         `http://localhost:5000/register`,
//         newUser
//       );
//       console.log(response);
//       // Set the state values accordingly
//       // setIsAuthenticated(true);
//       setUserRole(response.data.user.user_role);
//       // setToken(token);
//       return response.data.user;
//     } catch (error) {
//       console.error("Error signing up: ", error);
//       throw error;
//     }
//   };

//   const login = async (username, password) => {
//     // Handle the login logic here
//     try {
//       const user = {
//         user_name: username,
//         password: password,
//       };
//       const response = await axios.post(`http://localhost:5000/connect`, user);
//       const token = response.data.token;
//       console.log(token);
//       const role = response.data.user.user_role;
//       console.log(role);
//       console.log(response.data.user.user_role);
//       Cookies.set("token", token);
//       console.log(Cookies.get('token'));
//       console.log("before set user role:", userRole);
//       // Set the state values accordingly
//       verifyToken();
//       setIsAuthenticated(true);
//       setUserRole(role); //retrieve user role
//       console.log("after set user role:", response);
//       setToken(token);
//     } catch (error) {
//       console.error("Error logging in: ", error);
//     }
//   };

//   const logout = () => {
//     // Handle the logout logic here
//     // Clear the state values and the cookie accordingly
//     setIsAuthenticated(false);
//     setUserRole("");
//     setToken("");
//     Cookies.remove("token");
//   };
  
//   const verifyToken = async (token) => {
//     // const token = Cookies.get("token");

//     if (token) {
//       setLoading(true);
//       try {
//         Cookies.set("token", token);
//         const response = await axios.get(`http://localhost:5000/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(response);
//         setIsAuthenticated(true);
//         setUserRole(response.data.user_role);
        
//         setToken(token);

//       } catch (error) {
//         console.error("Error verifying token:", error);
//         // Handle token invalidity (clear state, redirect to login)
//         setIsAuthenticated(false);
//         setUserRole("");
//         Cookies.remove("token");
//         // navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     const token = Cookies.get("token");
//     // verifyToken();
//     setToken(token);
//     setLoading(false);
//     setUserRole(userRole)
//   }, [userRole]);

//   // Define the value object to pass to the provider
//   const value = {
//     isAuthenticated,
//     userRole,
//     token,
//     signup,
//     login,
//     logout,
//     loading,
//   };

//   // Return the provider component with the value prop
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
