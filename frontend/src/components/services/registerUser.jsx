import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Container, Row, Col, Form, Button, Alert, InputGroup} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function SignUpPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // USER DATA
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios("/api/categories");
        const data = await response.data.categories;
        // console.log(data);
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleUserRole = (event) => {
    setUserRole(event.target.value);
  };

  const handleCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleUserName = (event) => {
    setUserName(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  // Define a function to toggle the password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    if (!email || !password) {
      setError("Please fill in all the fields.");
      return;
    }
    try {
      const newUser = {
        user_name: username,
        email: email,
        password: password,
        user_role: userRole,
        category: selectedCategory,
      };
      const response = await axios.post(`/api/register`, newUser);
      console.log(response);
      setSuccess("You have signed up successfully!"); // Set success message
      navigate("/login"); //redirect to login page
    } catch (error) {
      console.error("Error occured: ", error.response.data.message);
      setError(`${error.response.data.message}. Please try again.`); // Set error message
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  };

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column vh-100 align-items-center justify-content-center"
      >
        <Row className="align-items-center h-50">
          <Col md={8} className="text-start py-5 me-3">
            <h1 className="display-4 fw-bold text-primary ms-5 mb-4">
              Ditch the hassle, embrace efficiency.
            </h1>
            <p className="lead fs-5 pb-3 ms-5 me-5 pe-5">
              Raise issues, track progress, and get them swiftly resolved with
              our efficient service app. Sign up today!
            </p>
          </Col>
          <Col md={3} className="ms-3">
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="user_name"
                  value={username}
                  onChange={handleUserName}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePassword}
                    placeholder="Enter password"
                  />
                  <Button variant="outline-secondary" onClick={togglePassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={userRole}
                  name="user_role"
                  onChange={handleUserRole}
                >
                  <option value="">Select Role</option>
                  <option value="maintenance_officer">
                    Maintenance Officer
                  </option>
                  <option value="user">User/Requestor</option>
                  <option value="technician">Technician</option>
                </Form.Select>
              </Form.Group>
              {userRole === "technician" && (
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={selectedCategory}
                    name="category"
                    onChange={handleCategory}
                  >
                    <option value="">Select Category</option>
                    {isLoading ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.category_name}
                        </option>
                      ))
                    )}
                  </Form.Select>
                </Form.Group>
              )}
              <Button className="w-100" type="submit">
                Sign Up
              </Button>
              <Link to="/login" className="w-100">
                <p className="mt-3">Already have an account?</p>
                <Button className="w-100">Log In</Button>
              </Link>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SignUpPage;
