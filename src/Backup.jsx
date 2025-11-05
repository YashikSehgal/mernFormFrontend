import React, { useState } from "react";

const App = () => {
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false); // 👈 new state

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // ⏳ Start loading

    const formData = new FormData();
    formData.append("name", nameInput);
    formData.append("age", ageInput);
    formData.append("message", msgInput);
    formData.append("email", emailInput);

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images", imageFiles[i]);
    }

    try {
      const response = await fetch("http://localhost:3006/addUser", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("✅ User added successfully:", data);

      // Reset form
      setNameInput("");
      setAgeInput("");
      setMsgInput("");
      setEmailInput("");
      setImageFiles([]);
    } catch (err) {
      console.error("❌ Error adding user:", err);
    } finally {
      setLoading(false); // 🟢 Stop loading in both success or failure
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          disabled={loading} // ⛔ disable while loading
        />

        <label>Age</label>
        <input
          type="text"
          value={ageInput}
          onChange={(e) => setAgeInput(e.target.value)}
          disabled={loading}
        />

        <label>Message</label>
        <input
          type="text"
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          disabled={loading}
        />

        <label>Email</label>
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          disabled={loading}
        />

        <label>Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImageFiles(e.target.files)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"} {/* 👈 dynamic button text */}
        </button>
      </form>

      {/* 👇 Optional message below form */}
      {loading && (
        <p style={{ color: "blue", marginTop: "15px" }}>
          ⏳ Form is being submitted, please wait...
        </p>
      )}
    </div>
  );
};

export default App;
