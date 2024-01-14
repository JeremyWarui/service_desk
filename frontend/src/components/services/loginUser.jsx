import React, { useState, useEffect, useContext } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

// import { getRedirectPathBasedOnRole, useAuth } from "../auth/AuthContext";
//we shall look into how our userDashboard was able to 
// to perform auth context on hard code

function LoginPage() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [token, setToken] = useState("");
  // const [loading, setLoading] = useState(false); 
  // const { login, userRole } = useAuth();
  const navigate = useNavigate();

// Define a function to toggle the password visibility
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

  const getRedirectPathBasedOnRole = (userRole) => {
    const paths = {
      maintenance_officer: "/maintenance-dashboard/",
      user: "/users-dashboard/",
      technician: "/technicians-dashboard/",
      admin: "/",
    };
    console.log(userRole);
    return (paths[userRole] ?  paths[userRole] : "/login"); // Handle unknown roles
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    // try {
    //   await login(username, password);
    //   console.log("Updated userRole:", userRole);
      
    //   //redirect based on roles
    //   console.log(userRole);
    //   const redirectPath = getRedirectPathBasedOnRole(userRole);
    //   console.log("Redirecting to:", redirectPath);
    //   setSuccess("Success!!"); // Set success message
    //   setTimeout(() => {
    //     setSuccess('')
    //   }, 3000);
    //   navigate(redirectPath);
    // } catch (error) {
    //   console.error("Error occured: ", error.response.data.message);
    //   setError(`${error.response.data.message}. Please try again.`); // Set error message
    //   setTimeout(() => {
    //     setError('')
    //   }, 3000);
    // }
    try {
      const user = {
        user_name: username,
        password: password,
      };
      const response = await axios.post(`http://localhost:5000/connect`, user);
      const token = response.data.token;
      Cookies.set('token', token);
      // console.log(response);
      setSuccess("Success!!"); // Set success message
      const userId = response.data.user._id;
      const userRole = response.data.user.user_role;
      setIsAuthenticated(true);
      setUserId(userId);
      setUserRole(userRole);
      setToken(token);
      setSuccess("Success!!"); // Set success message
      setTimeout(() => {
        setSuccess('')
      }, 3000);
      const redirectPath = getRedirectPathBasedOnRole(userRole);
      navigate(redirectPath);
    } catch (error) {
      console.error("Error occured: ", error.response.data.message);
      setError(`${error.response.data.message}. Please try again.`); // Set error message
      setTimeout(() => {
        setError('')
      }, 3000);
    } finally {
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column vh-100 align-items-center justify-content-center"
    >
      <Row className="align-items-center h-50">
        <Col md={7} className="text-start py-5 me-3">
          <h1 className="display-4 fw-bold text-primary ms-5 mb-4">
            ResolveRocket
          </h1>
          <p className="lead fs-5 pb-3 ms-5 me-5 pe-5">
            Experience the best features and streamlined workflows for your
            productivity.
          </p>
        </Col>
        <Col md={3} className="ms-5">
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
                <Button variant="outline-secondary" onClick={togglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button className="w-100" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
