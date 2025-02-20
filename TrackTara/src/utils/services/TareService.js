// src/utils/services/TareService.js
import axios from 'axios';

const API_URL = 'http://localhost:5081/containers';
export const createTare = async (tareData) => {
    await axios.post(`${API_URL}/add`, tareData);
};
export const getAllTares = async () => {
    const response = await axios.get(`${API_URL}/get-all`);
    return response.data;
};
export const getTareById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
export const deleteTare = async (id) => {
    await axios.delete(`${API_URL}/delete/${id}`);
};

export const setProductToTare = async (containerId, productId) => {
    await axios.put(`${API_URL}/set-product/${containerId}`, { productId });
};
export const updateTare = async (id, tareData) => {
    await axios.put(`${API_URL}/update/${id}`, tareData);
};
export const clearProductFromTare = async (containerId) => {
    await axios.put(`${API_URL}/clear-product/${containerId}`);
};