// src/utils/services/ProductService.js
import axios from 'axios';
import  REMOTE_HOST_NAME  from "../../env/index";

const API_URL = REMOTE_HOST_NAME + 'products';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const ProductService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/get-by-id/${id}`, getAuthHeaders());
    return response.data;
  },
  addProduct: async (product) => {
    const response = await axios.post(`${API_URL}/add`, product, getAuthHeaders());
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    return response.data;
  },
};