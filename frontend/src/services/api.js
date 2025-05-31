// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getPortfolio = async () => {
  try {
    const response = await axios.get(`${API_URL}/portfolio`);
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
};

export const addStock = async (stockData) => {
  try {
    const response = await axios.post(`${API_URL}/portfolio`, stockData);
    return response.data;
  } catch (error) {
    console.error("Error adding stock:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Network error or server issue");
  }
};

export const updateStockPrice = async (id, current_market_price) => {
  try {
    const response = await axios.put(`${API_URL}/portfolio/${id}/price`, { current_market_price });
    return response.data;
  } catch (error) {
    console.error("Error updating stock price:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Network error or server issue");
  }
};

export const deleteStock = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/portfolio/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting stock:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Network error or server issue");
  }
};