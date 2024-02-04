// AdminLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Adminlogin.css';
function AdminLogin() {
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
    <div className="main">
    <div className="admin-login-container">
      <div className="admin-login-heading">
      <h2>Admin Login</h2>
      </div>
      <input className="admin-login-input"
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)} />
      <input className="admin-login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />
      <button className="admin-login-button" onClick={handleAdminLogin}>Login</button>
      {error && <p className="admin-login-error">{error}</p>}
      <p className="admin-login-link">
        If you are a customer,{" "}
        <Link to="/Customer/login">click here</Link>
      </p>
    </div>
    </div>
    
  );
}

export default AdminLogin;
