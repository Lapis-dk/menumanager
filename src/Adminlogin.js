// AdminLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    // Implement admin login logic here (check userId and password)
    if (userId === "admin" && password === "123") {
      navigate("/Manager");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAdminLogin}>Login</button>
      {error && <p>{error}</p>}
      <p>
        If you are a customer,{" "}
        <Link to="/Customer/login">click here</Link>
      </p>
    </div>
  );
};

export default AdminLogin;
