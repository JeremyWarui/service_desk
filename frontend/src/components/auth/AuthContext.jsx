import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const login = async (user_name, password) => {
    // Assuming you have an API endpoint for authentication
    try {
      const response = await axios.post("http://localhost:5000/connect", {
        user_name,
        password,
      });
      // console.log(response);
      if (
        response.data &&
        response.data.user._id &&
        response.data.user.user_role &&
        response.data.token
      ) {
        const { user, token } = response.data;

        // Set user information in the context
        setUser(user);
        setToken(token);
        // console.log(token);
        var now = new Date();
        var expireTime = now.getTime() + 20 * 60 * 1000; // 20 minutes in milliseconds
        now.setTime(expireTime);

        Cookies.set("token", token, {
        // httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: now,
      });
        return { user, token };
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Authentication failed");
    }
  };

  const logout = () => {
    // Clear the token from cookies
    Cookies.remove("token");
    // Clear the user and token from the context
    setUser(null);
    setToken("");
  };

  useEffect(() => {
    // Get the token from cookies
    const token = Cookies.get("token");
    // console.log("Token from cookies: ", token);
    // If the token exists, use it to get the user data
    if (token) {
      // Assuming you have an API endpoint for getting the current user
      axios.get("http://localhost:5000/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Set the user and token in the context
          // console.log(response);
          setUser(response.data);
          setToken(token);
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
        });
      // console.log("in then: token ", token);
      // console.log(user);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
