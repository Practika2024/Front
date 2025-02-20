// src/utils/services/ContainerService.js
import axios from 'axios';

const API_URL = 'http://localhost:5081/containers';
export const createContainer = async (tareData) => {
    await axios.post(`${API_URL}/add`, tareData);
};
export const getAllContainers = async () => {
    const response = await axios.get(`${API_URL}/get-all`);
    return response.data;
};
export const getContainerById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
export const deleteContainer = async (id) => {
    await axios.delete(`${API_URL}/delete/${id}`);
};

export const setProductToContainer = async (containerId, productId) => {
    await axios.put(`${API_URL}/set-product/${containerId}`, { productId });
};
export const updateContainer = async (id, tareData) => {
    await axios.put(`${API_URL}/update/${id}`, tareData);
};
export const clearProductFromTare = async (containerId) => {
    await axios.put(`${API_URL}/clear-product/${containerId}`);
};