import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const TechnicianContext = createContext();

const TechnicianProvider = ({ children }) => {
  // const [technicianId, setTechnicianId] = useState("657c5a4e6bef093354653d28");
  const [technician, setTechnician] = useState({
    _id: "657c5a4e6bef093354653d28",
    user_role: "technician",
  });

  // console.log(technician);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${technician._id}`
        );
        setTechnician(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Handle errors gracefully
      }
    };

    fetchUser();
  }, []);

  return (
    <TechnicianContext.Provider value={{ technician }}>
      {children}
    </TechnicianContext.Provider>
  );
};

export { TechnicianContext, TechnicianProvider };
