// src/utils/services/ProductHistoryService.js
import axios from 'axios';

const API_URL = 'http://localhost:5081/products-history';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getAllProductHistories = async (productId) => {
    const response = await axios.get(`${API_URL}?productId=${productId}`, getAuthHeaders());
    return response.data;
};

export const getProductHistoryById = async (productHistoryId) => {
    const response = await axios.get(`${API_URL}/get-by-id/${productHistoryId}`, getAuthHeaders());
    return response.data;
};

