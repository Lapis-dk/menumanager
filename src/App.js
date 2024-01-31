import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import AdminLogin from "./Adminlogin";
import CustomerLogin from "./Customerlogin";
import CustomerPage from "./CustomerPage";
import MenuManager from "./MenuManager";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/manager" element={<MenuManager />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
