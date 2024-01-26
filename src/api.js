import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getAllMenuItems = () => api.get('/menuItems');
export const getMenuItemById = (id) => api.get(`/menuItems/${id}`);
export const addMenuItem = (menuItem) => api.post('/menuItems', menuItem);
export const updateMenuItem = (id, updatedMenuItem) => api.put(`/menuItems/${id}`, updatedMenuItem);
export const deleteMenuItem = (id) => api.delete(`/menuItems/${id}`);

const apiService = {
  getAllMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};

export default apiService;
