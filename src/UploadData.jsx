import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadData.css"

const UploadData = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check login & role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "admin") {
      alert("Only admin can access this page. Login first!");
      navigate("/", { replace: true });
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/", { replace: true });
  };

  const goToViewData = () => {
    navigate("/ViewData");
  };


  const handleAddImages = (e) => {
  const newFiles = Array.from(e.target.files);
  setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", nameInput);
    formData.append("age", ageInput);
    formData.append("message", msgInput);
    formData.append("email", emailInput);
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images", imageFiles[i]);
    }

    try {
      const response = await fetch("https://mernformbackend-rph4.onrender.com/addUser", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("User added successfully:", data);

      if (response.ok) {
      setSuccessMessage("User added successfully!");
      } else {
      setSuccessMessage("Error adding user.");
      }


      
      setNameInput("");
      setAgeInput("");
      setMsgInput("");
      setEmailInput("");
      setImageFiles([]);
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }} className="upload-container">
      <h2>Welcome, {currentUser?.name || "Admin"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} disabled={loading} />

        <label>Age</label>
        <input type="text" value={ageInput} onChange={(e) => setAgeInput(e.target.value)} disabled={loading} />

        <label>Message</label>
        <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} disabled={loading} />

        <label>Email</label>
        <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} disabled={loading} />

        <label>Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddImages}
          disabled={loading}
        />

          {/* Show list of uploaded image names */}
          {imageFiles.length > 0 && (
            <div className="uploaded-list">
              {imageFiles.map((file, index) => (
                <p key={index} className="uploaded-file-name">
                  {file.name}
                </p>
              ))}
            </div>
          )}

          {/* Add More Images Button */}
          {imageFiles.length > 0 && (
            <button
              type="button"
              className="add-more-btn"
              onClick={() => document.getElementById("addMoreInput").click()}
              disabled={loading}
            >
              ➕ Add More Images
            </button>
          )}

          {/* Hidden input for "Add More" */}
          <input
            id="addMoreInput"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleAddImages}
          />


        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {loading && (
        <p style={{ color: "blue", marginTop: "15px" }} className="loading-text">
          ⏳ Form is being submitted, please wait...
        </p>
      )}

      {/* Admin buttons at the bottom */}
      <div style={{ marginTop: "40px" }} className="admin-buttons">
        <button onClick={goToViewData} style={{ marginRight: "10px" }}>
          View Data
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UploadData;
