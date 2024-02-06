import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CustomerPage.css';
import axios from 'axios';
import { message } from 'antd';
import { Tabs, Modal, Result, Button, Table, InputNumber } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const CustomerPage = () => {
  const location = useLocation();
  const selectedTable = location.state.selectedTable;
  const phoneNo = location.state.phoneNo;

  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [confirmation, setConfirmation] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const navigate = useNavigate();
  const [averageCookingTime, setAverageCookingTime] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); // Add totalPrice state

  const generateUniqueId = useCallback((itemId) => {
    return `${itemId}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

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

  useEffect(() => {
    if (selectedMenuItem) {
      const existingCartItemIndex = cart.findIndex(item => item.id === selectedMenuItem.id);
  
      if (existingCartItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingCartItemIndex].quantity += selectedQuantity;
        setCart(updatedCart);
      } else {
        const cartItem = {
          ...selectedMenuItem,
          cartId: generateUniqueId(selectedMenuItem.id),
          quantity: selectedQuantity,
        };
        setCart(prevCart => [...prevCart, cartItem]);
      }
  
      // Reset selectedMenuItem and selectedQuantity after adding to cart
      setSelectedMenuItem(null);
      setSelectedQuantity(1);
      
      // Display a message indicating the item has been added to the cart
      message.success(`${selectedQuantity} ${selectedMenuItem.name}(s) added to cart`);
    }
  }, [cart, generateUniqueId, selectedMenuItem, selectedQuantity]);

  const handleRemoveFromCart = useCallback((cartId) => {
    const updatedCart = cart.filter((item) => item.cartId !== cartId);
    setCart(updatedCart);
  }, [cart]);

  const handleEditButtonClick = useCallback((item) => {
    setEditItem(item);
    setEditQuantity(item.quantity);
    setEditModalVisible(true);
  }, []);

  const handleEditItem = useCallback(() => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(item => item.cartId === editItem.cartId);
    updatedCart[index].quantity = editQuantity;
    setCart(updatedCart);
    setEditModalVisible(false);
  }, [cart, editItem, editQuantity]);

  const handleEditModalClose = useCallback(() => {
    setEditModalVisible(false);
  }, []);

  const handleConfirmOrder = useCallback(async () => {
    try {
      const totalCookingTime = calculateTotalTime();
      const averageCookingTime = totalCookingTime / cart.length;
  
      const totalOrderPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
      const dataToUpdate = {
        orderedMenuItems: cart.map(item => item.name),
        phoneNumber: phoneNo,
        occupied: true,
        totalCookingTime: totalCookingTime,
      };
  
      await axios.put(`http://localhost:8080/api/tables/${selectedTable}`, dataToUpdate);
      
      setConfirmation("Order confirmed!");
      setShowConfirmationModal(true); 
      setAverageCookingTime(averageCookingTime);
      setTotalPrice(totalOrderPrice); 
      setCart([]); 
  
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  }, [cart, phoneNo, selectedTable]);
  
  const calculateTotalTime = useCallback(() => {
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    const totalCookingTime = cart.reduce((total, item) => total + (item.cookingTime * item.quantity), 0);
    const averageCookingTime = totalCookingTime / totalQuantity;
    return averageCookingTime.toFixed(0); 
  }, [cart]);

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, record) => `$${record.price * record.quantity}`,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditButtonClick(record)}>Edit</Button>
          <Button onClick={() => handleRemoveFromCart(record.cartId)}>Remove</Button>
        </>
      ),
    },
  ];

  const handleModalClose = useCallback(() => {
    setShowConfirmationModal(false);
  }, []);

  const goToHomePage = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="customer-page">
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane tab="Menu" key="1">
          <h2>Menu</h2>
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.id} className="menu-item">
                <div className="menu-image">
                  <img className="img" src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p>${item.price}</p>
                  <InputNumber className='box' min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
                  <Button onClick={() => { setSelectedMenuItem(item); }}>Add to Cart</Button>
                </div>
              </li>
            ))}
          </ul>
        </TabPane>
        <TabPane tab="Cart" key="2">
          <div className="cart-container">
            <h3>Cart</h3>
            <Table dataSource={cart} columns={columns} pagination={false} />
            <p>Total Price: ${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</p>
            <p>Average Cooking Time: {calculateTotalTime()} mins</p>
            <button
              onClick={handleConfirmOrder}
              style={{
              backgroundColor: '#1890ff',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              }}
              >
              Confirm Order
            </button>
            {confirmation && <p>{confirmation}</p>}
           
            {showConfirmationModal && (
              <Modal
                visible={true}
                onCancel={handleModalClose}
                footer={[
                  <Button key="console" onClick={goToHomePage}>
                    Go to Console
                  </Button>,
                ]}
              >
                <Result
                  status="success"
                  title="Your order has been placed successfully"
                  subTitle={`Phone number: ${phoneNo} Table number: ${selectedTable}`}
                  icon={<SmileOutlined />}
                />
                <p>Total Price: ${totalPrice}</p>
                <p>Average Cooking Time: {Math.round(averageCookingTime)} mins</p>
              </Modal>
            )}


            <Modal
              title="Edit Quantity"
              visible={editModalVisible}
              onOk={handleEditItem}
              onCancel={handleEditModalClose}
              okText="Save"
              cancelText="Cancel"
              style={{ borderRadius: '10px' }}
              bodyStyle={{ backgroundColor: '#f0f2f5', padding: '20px' }}
            >
              <p style={{ marginBottom: '10px' }}>Quantity:</p>
              <InputNumber
                min={1}
                value={editQuantity}
                onChange={setEditQuantity}
                style={{ width: '100%' }}
              />
            </Modal>

          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CustomerPage;
