import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div>
      <h2>Customer Login</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
      />
      <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
        <option value="">Select a table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id}>{table.id}</option>
        ))}
      </select>
      <button onClick={handleCustomerLogin}>Login</button>
      {error && <p>{error}</p>}
      <p>
        If you are an admin,{" "}
        <Link to="/Admin/login">click here</Link>
      </p>
    </div>
  );
};

export default CustomerLogin;
