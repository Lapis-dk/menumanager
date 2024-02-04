import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Customerlogin.css';
import axios from 'axios';

const CustomerLogin = () => {
  const [phoneNo, setPhoneNo] = useState("");
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tables/available');
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching available tables:', error);
      }
    };

    fetchAvailableTables();
  }, []);

  const handleCustomerLogin = () => {
    // Validate phone number
    if (!/^\d{10}$/.test(phoneNo)) {
      setError("Invalid phone number");
      return;
    }

    // Validate selected table
    if (!selectedTable) {
      setError("Please select a table");
      return;
    }

    // Proceed with login
    // Here you can navigate to the CustomerPage component
    navigate("/Customer", { state: {phoneNo, selectedTable } });
  };

  return (
    <div className="main">
    <div className="customer-login-container">
      <h2 className="customer-login-heading">Customer Login</h2>
      <input className="customer-login-input"
        type="text"
        placeholder="Phone Number"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
      />
      <select className="customer-login-select" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
        <option value="">Select a table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id}>{table.id}</option>
        ))}
      </select>
      <button className="customer-login-button" onClick={handleCustomerLogin}>Login</button>
      {error && <p className="customer-login-error">{error}</p>}
      <p className="customer-login-link">
        If you are an admin,{" "}
        <Link to="/Admin/login">click here</Link>
      </p>
    </div>
    </div>
  );
};

export default CustomerLogin;
