import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CustomerPage.css';
import axios from 'axios';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const CustomerPage = () => {
  const location = useLocation();
  const selectedTable = location.state.selectedTable;
  const phoneNo = location.state.phoneNo;

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/menuItems');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddToCart = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/menuItems/${itemId}`);
      const selectedItem = response.data;

      const cartItem = {
        ...selectedItem,
        cartId: generateUniqueId(selectedItem.id),
      };

      setCart((prevCart) => [...prevCart, cartItem]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const generateUniqueId = (itemId) => {
    return `${itemId}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleRemoveFromCart = (cartId) => {
    const updatedCart = cart.filter((item) => item.cartId !== cartId);
    setCart(updatedCart);
  };

  const handleConfirmOrder = async () => {
    try {
      // Prepare data to be updated
      const dataToUpdate = {
        orderedMenuItems: cart.map(item => item.name),
        phoneNumber: phoneNo,
        occupied: true,
      };
  
      // Update table with ordered menu items, phone number, and mark as occupied
      await axios.put(`http://localhost:8080/api/tables/${selectedTable}`, dataToUpdate);
  
      // Clear cart and show confirmation
      setCart([]);
      setConfirmation("Order confirmed!");
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };
  

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="customer-page">
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane tab="Menu" key="1">
          <h2>Menu</h2>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.id} className="menu-item">
                <div className="menu-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p>${item.price}</p>
                  <button onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
                </div>
              </li>
            ))}
          </ul>
        </TabPane>
        <TabPane tab="Cart" key="2">
          <div className="cart-container">
            <div className="cart">
              <h3>Cart</h3>
              <ul>
                {cart.map((item) => (
                  <li key={item.cartId} className="menu-item">
                    <div className="menu-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                      <button onClick={() => handleRemoveFromCart(item.cartId)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <p>Total: ${calculateTotal()}</p>
              <button onClick={handleConfirmOrder}>Confirm Order</button>
              {confirmation && <p>{confirmation}</p>}
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CustomerPage;
