import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, user, token } = useAuth();
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
    return paths[userRole] ? paths[userRole] : "/login"; // Handle unknown roles
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    try {
      const { user } = await login(user_name, password);

      // await login(username, password);
      console.log("user_role:", user.user_role);
      const role = user.user_role;
      //redirect based on roles
      const redirectPath = getRedirectPathBasedOnRole(role);
      console.log("Redirecting to:", redirectPath);
      setSuccess("Success!!"); // Set success message
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      navigate(redirectPath);
    } catch (error) {
      console.log(error);
      console.error("Error occured: ", error.response.data.message);
      setError(`${error.response.data.message}. Please try again.`); // Set error message
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    // Redirect the user if they are already logged in
    if (user && token) {
      // Get the redirect path based on the user role
      const redirectPath = getRedirectPathBasedOnRole(user.user_role);
      // Navigate to the path
      navigate(redirectPath);
    }
  });

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
                value={user_name}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
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
            <Link to="/signup" className="w-100">
              <Button className="w-100 mt-3">Sign Up</Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
