// src/utils/services/OrderService.js
import axios from 'axios';

const API_URL = 'http://localhost:5081/orders';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getAllOrders = async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await axios.get(`${API_URL}/get-by-id/${orderId}`, getAuthHeaders());
    return response.data;
};

export const getOrdersBySector = async (sector) => {
    const response = await axios.get(`${API_URL}/get-by-sector/${sector}`, getAuthHeaders());
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await axios.post(`${API_URL}/create`, orderData, getAuthHeaders());
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await axios.put(`${API_URL}/update-status/${orderId}`, { status }, getAuthHeaders());
    return response.data;
};

export const pickProduct = async (orderId, itemId, productCode, containerCode, issueLineCode, cartNumber) => {
    const response = await axios.post(`${API_URL}/pick-product`, {
        orderId,
        itemId,
        productCode,
        containerCode,
        issueLineCode,
        cartNumber,
    }, getAuthHeaders());
    return response.data;
};

export const pickProductPartial = async (orderId, itemId, productCode, containerCode, quantity, cartNumber, needNewCart = false) => {
    const response = await axios.post(`${API_URL}/pick-product-partial`, {
        orderId,
        itemId,
        productCode,
        containerCode,
        quantity,
        cartNumber,
        needNewCart,
    }, getAuthHeaders());
    return response.data;
};

// Експортуємо як об'єкт для сумісності з MockOrderService
export const OrderService = {
    getAllOrders,
    getOrderById,
    getOrdersBySector,
    createOrder,
    updateOrderStatus,
    pickProduct,
    pickProductPartial,
};

