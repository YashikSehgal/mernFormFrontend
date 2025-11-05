import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import ViewData from "./ViewData";
import UploadData from "./UploadData";
import "./App.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage setCurrentUser={setCurrentUser} />} />

        {/* ✅ Allow both admin and user to access ViewData */}
        <Route
          path="/ViewData"
          element={
            currentUser && (currentUser.role === "user" || currentUser.role === "admin") ? (
              <ViewData />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ✅ Only admin can access UploadData */}
        <Route
          path="/UploadData"
          element={
            currentUser && currentUser.role === "admin" ? (
              <UploadData />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
