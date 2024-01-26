// import React from "react";
 
// const AuthenticationPage = () => {
//     return (
//         <div>
//             <h1>Manager</h1>
//         </div>
//     );
// };
 
// export default AuthenticationPage;
// HotelManagerPage.jsx

import React, { useState, useEffect } from 'react';
// import './HotelManagerPage.css'; // You can create a new CSS file for manager styles
import axios from 'axios';

const MenuManager= () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/menuItems');
      console.log('Menu Items:', response.data);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleAddItem = async () => {
    try {
      // Send a POST request to add a new menu item
      await axios.post('http://localhost:8080/api/menuItems', newItem);

      // Fetch updated menu items
      fetchMenuItems();

      // Reset the newItem state
      setNewItem({
        name: '',
        description: '',
        price: 0,
        image: '',
      });
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      // Send a DELETE request to remove a menu item
      await axios.delete(`http://localhost:8080/api/menuItems/${itemId}`);

      // Fetch updated menu items
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="hotel-manager-page">
      <h2>Hotel Manager Dashboard</h2>
      
      {/* Add Item Form */}
      <div className="add-item-form">
        <h3>Add New Item</h3>
        <label>Name:</label>
        <input type="text" name="name" value={newItem.name} onChange={handleInputChange} />
        <label>Description:</label>
        <textarea name="description" value={newItem.description} onChange={handleInputChange} />
        <label>Price:</label>
        <input type="number" name="price" value={newItem.price} onChange={handleInputChange} />
        <label>Image URL:</label>
        <input type="text" name="image" value={newItem.image} onChange={handleInputChange} />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {/* Menu Items List */}
      <div className="menu-items-list">
        <h3>Menu Items</h3>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <div>
                <img src={item.image} alt={item.name} />
              </div>
              <div>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>${item.price}</p>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuManager;
