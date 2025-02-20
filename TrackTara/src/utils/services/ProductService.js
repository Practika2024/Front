import axios from 'axios';

const API_URL = 'http://localhost:5081/products';

export const getAllProducts = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};