import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [error, setError] = useState("");

  // ✅ 1. Check if user already logged in (on page refresh)
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
      // auto-redirect based on role
      if (loggedInUser.role === "admin") {
        navigate("/UploadData", { replace: true });
      } else {
        navigate("/ViewData", { replace: true });
      }
    }
  }, [navigate, setCurrentUser]);

  // ✅ 2. Handle signup / login
  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((u) => u.email === email);

    if (isSignup) {
      if (existingUser) {
        setError("Email already exists!");
        return;
      }

      const newUser = { name, email, password, role };
      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Save login session
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setCurrentUser(newUser);

      // Redirect
      role === "admin" ? navigate("/UploadData") : navigate("/ViewData");
    } else {
      // Login flow
      if (!existingUser || existingUser.password !== password) {
        setError("Invalid email or password!");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      setCurrentUser(existingUser);

      existingUser.role === "admin" ? navigate("/UploadData") : navigate("/ViewData");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Role dropdown only for signup */}
        {isSignup && (
          <div>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        {/* Name only for signup */}
        {isSignup && (
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
        )}

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">{isSignup ? "Signup" : "Login"}</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}
        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
        >
          {isSignup ? "Login" : "Signup"}
        </button>
      </p>
    </div>
  );
};

export default Homepage;
