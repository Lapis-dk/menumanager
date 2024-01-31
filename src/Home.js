import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <br />
      <ul>
        <li>
          <Link to="/admin/login">Admin Login</Link>
        </li>
        <li>
          <Link to="/customer/login">Customer Login</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
