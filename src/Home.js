import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Home.css';

const Home = () => {
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex(prevIndex => (prevIndex + 1) % 4); // Rotate through four images
    }, 5000); // Change background every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`cont ${getBackgroundClass(backgroundIndex)}`}>
      <header>
        <h1 className="hom">Indulge in Flavorful Moments:</h1>
        <h2 className="hom1">Where Every Bite Tells a Story!</h2>
        <p className="homy">Order now!</p>
        <div className="but">
          <Link to="/admin/login" className="butt">Admin Login</Link>
          <Link to="/customer/login" className="butt">Customer Login</Link>
        </div>
      </header>
    </div>
  );
};

// Helper function to get the background class based on the index
const getBackgroundClass = (index) => {
  switch (index) {
    case 0:
      return 'background1';
    case 1:
      return 'background2';
    case 2:
      return 'background3';
    case 3:
      return 'background4';
    default:
      return 'background1';
  }
};

export default Home;
