import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewData = () => {
  const [users, setUsers] = useState([]);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Check login & role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      alert("Please login first to access this page!");
      navigate("/", { replace: true });
    } else if (user.role !== "user" && user.role !== "admin") {
      alert("Access denied!");
      navigate("/", { replace: true });
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  // First load only
  useEffect(() => {
    if (!fetchedOnce) {
      fetch("https://mernformbackend-rph4.onrender.com/collectionData")
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          setFetchedOnce(true);
        })
        .catch((err) => console.error(err));
    }
  }, [fetchedOnce]);

  const handleRefresh = () => {
    fetch("https://mernformbackend-rph4.onrender.com/collectionData")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/", { replace: true });
  };

  const goToUploadData = () => {
    if (currentUser?.role === "admin") {
      navigate("/UploadData");
    } else {
      alert("Only admin can access UploadData!");
    }
  };

  return (
    <div>
      <h2>Welcome, {currentUser?.name || "User"}</h2>

    


      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleRefresh} style={{ marginRight: "10px" }}>
          Load Latest Users
        </button>
        {currentUser?.role === "admin" && (
          <button onClick={goToUploadData} style={{ marginRight: "10px" }}>
            Upload Data
          </button>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>

      {users.map((user, index) => (
        <div
          key={index}
          style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}
        >
          <h3>{user.name}</h3>
          <p>Age: {user.age}</p>
          <p>Message: {user.message}</p>
          <p>Email: {user.email}</p>
          <div>
            {user.image.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`user-${index}-${i}`}
                width="100"
                style={{ marginRight: "10px" }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewData;
