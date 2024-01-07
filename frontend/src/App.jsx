// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import UserDashboard from "./components/usersComponent/userDashboard";
// import TechnicianDashboard from "./components/techniciansComponent/technicianDashboard";
// import MaintenanceDashboard from "./components/maintenanceComponent/maintenanceDashboard";
// import Homepage from "./components/homepage";
// import IssueList from "./components/issuesComponent/issueList";
// import IssueDetails from "./components/issuesComponent/issueDetails";
// import AssignmentList from "./components/issuesComponent/assignmentList";
// import AssignmentDetails from "./components/issuesComponent/assignmentDetails";

// function App() {
//   return (
//     <Router>
//       {/* Other routes for different user roles or functionalities */}
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/users/dashboard/*" element={<UserDashboard />} />
//         <Route
//           path="/technicians/dashboard/*"
//           element={<TechnicianDashboard />}
//         />
//         <Route path="/maintenance/dashboard/*" element={<MaintenanceDashboard />} />
//         {/* Nested route for the /issues path */}
//         <Route path="/issues" element={<IssueList />}>
//           <Route path=":issue_id" element={<IssueDetails />}>
//             <Route path="assignments" element={<AssignmentList />}>
//               <Route path=":assignment_id" element={<AssignmentDetails />} />
//             </Route>
//           </Route>
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/usersComponent/userDashboard";
import TechnicianDashboard from "./components/techniciansComponent/technicianDashboard";
import MaintenanceDashboard from "./components/maintenanceComponent/maintenanceDashboard";
import Homepage from "./components/homepage";

function App() {
  return (
    <Router>
      {/* Other routes for different user roles or functionalities */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/users/dashboard/*" element={<UserDashboard />} />
        <Route
          path="/technicians/dashboard/*"
          element={<TechnicianDashboard />}
        />
        < Route path="/maintenance/dashboard/*" element={<MaintenanceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
