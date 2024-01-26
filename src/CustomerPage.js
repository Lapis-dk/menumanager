// // CustomerPage.jsx
// import React, { useState } from 'react';
// import './CustomerPage.css'
// import burgerImage from './img/burger.jpeg';
// import fullchicken from './img/fullchicken.jpeg';
// import hotpot from './img/hotpot.jpeg';
// import noodles from './img/noodles.jpeg';
// import salad from './img/salad.jpeg';
// import shawarma from './img/shawarma.jpeg';

// const menuItems = [
//   { id: 1, name: 'Burger', description: 'Delight your taste buds with our mouthwatering burgers, crafted from the finest ingredients, and served with love, one juicy bite at a time.', price: 100, image: burgerImage },
//   { id: 2, name: 'fullchicken', description: 'Experience the mouthwatering delight of our expertly grilled chicken, where each succulent bite is a journey of smoky tenderness and savory satisfaction.', price: 150, image: fullchicken },
//   { id: 3, name: 'hotpot', description: 'Dive into a steaming hotpot adventure, where fresh ingredients simmer in a fragrant broth, creating a customizable culinary journey that warms your soul with every savory sip.', price: 120, image: hotpot },
//   { id: 4, name: 'Wild Noodles', description: 'Savor the flavor with our delectable Noodle Nirvana.', price: 150, image: noodles },
//   { id: 5, name: 'Wild Shawarma', description: 'Savor the taste of our Shawarma - slow-cooked meats, fragrant spices, and fresh, crisp vegetables, all wrapped in a warm, fluffy pita for a truly exotic culinary adventure', price: 199, image: shawarma },
//   { id: 6, name: 'Wild Salad', description: 'Crisp, fresh, and bursting with flavor, our Salad is like a symphony of colors and textures in every bite. ', price: 99, image: salad },
// ];

// const CustomerPage = () => {
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);

//   const generateUniqueId = () => {
//     return '_' + Math.random().toString(36).substr(2, 9);
//   };

//   const handleAddToCart = (item) => {
//     const cartItem = {
//       ...item,
//       cartId: generateUniqueId(),
//     };
//     setCart([...cart, cartItem]);
//   };

//   const handleRemoveFromCart = (cartId) => {
//     const updatedCart = cart.filter((item) => item.cartId !== cartId);
//     setCart(updatedCart);
//   };

//   const handleToggleCart = () => {
//     setShowCart(!showCart);
//   };

//   // Function to calculate the total amount
//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.price, 0);
//   };

//   return (
//     <div className="customer-page">
//       <div className="menu-container">
//         <h2>Menu Card</h2>
//         <div className="menu-list">
//           {menuItems.map((item) => (
//             <div key={item.id} className="menu-item">
//               <div className='menu-image'>
//                 <img src={item.image} alt={item.name} />
//               </div>
//               <div className='item-details'>
//                 <h3>{item.name}</h3>
//                 <p className="description">{item.description}</p>
//                 <p>${item.price}</p>
//                 <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className={`cart-container ${showCart ? 'open' : ''}`}>
//         <button className="cart-icon" onClick={handleToggleCart}>
//           🛒
//         </button>
//         <div className="cart-items">
//           <h2>Shopping Cart</h2>
//           <ul>
//             {cart.map((item) => (
//               <li key={item.cartId}>
//                 {item.name} - ${item.price} 
//                 <button onClick={() => handleRemoveFromCart(item.cartId)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//           <p>Total: ${calculateTotal()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerPage;

import React, { useState, useEffect } from 'react';
import './CustomerPage.css';
import axios from 'axios';
import burgerImage from './img/burger.jpeg';
import fullchicken from './img/fullchicken.jpeg';
import hotpot from './img/hotpot.jpeg';
import noodles from './img/noodles.jpeg';
import salad from './img/salad.jpeg';
import shawarma from './img/shawarma.jpeg';

const imageMap = {
  'Burger': burgerImage,
  'fullchicken': fullchicken,
  'hotpot': hotpot,
  'Wild Noodles': noodles,
  'Wild Shawarma': shawarma,
  'Wild Salad': salad,
};
const CustomerPage = () => {

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/menuItems');
        console.log('Menu Items:', response.data);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
  
    fetchMenuItems();
  }, []);
   // Empty dependency array means this effect runs once after the initial render

   const handleAddToCart = async (itemId) => {
    try {
      // Fetch the selected menu item from the backend
      const response = await axios.get(`http://localhost:8080/api/menuItems/${itemId}`);
      const selectedItem = response.data;
  
      // Generate a unique cartId for the item
      const cartItem = {
        ...selectedItem,
        cartId: generateUniqueId(selectedItem.id),
      };
  
      // Add the selected item to the cart
      setCart((prevCart) => [...prevCart, cartItem]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  // Function to generate a unique cartId based on itemId
  const generateUniqueId = (itemId) => {
    return `${itemId}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  const handleRemoveFromCart = (cartId) => {
    // Remove the selected item from the cart
    const updatedCart = cart.filter((item) => item.cartId !== cartId);
    setCart(updatedCart);
  };

  const handleToggleCart = () => {
    setShowCart(!showCart);
  };

  // Function to calculate the total amount
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="customer-page">
      <div className="menu-container">
        <h2>Menu Card</h2>
        <div className="menu-list">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <div className='menu-image'>
              <img src={imageMap[item.name]} alt={item.name} />
                            </div>
              <div className='item-details'>
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <p>${item.price}</p>
                <button onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`cart-container ${showCart ? 'open' : ''}`}>
        <button className="cart-icon" onClick={handleToggleCart}>
          🛒
        </button>
        <div className="cart-items">
          <h2>Shopping Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.cartId}>
                {item.name} - ${item.price} 
                <button onClick={() => handleRemoveFromCart(item.cartId)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total: ${calculateTotal()}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;

