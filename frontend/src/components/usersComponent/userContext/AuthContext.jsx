
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    // Hard-coded ID for testing (replace with actual ID)
    _id: "657c57fba79f7efb69d1660c",
    user_role: "user",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${user._id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Handle errors gracefully
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider }
