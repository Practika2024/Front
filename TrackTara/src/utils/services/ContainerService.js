// src/utils/services/ContainerService.js
import axios from 'axios';

const API_URL = 'http://localhost:5081/containers';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const createContainer = async (tareData) => {
    await axios.post(`${API_URL}/add`, tareData, getAuthHeaders());
};

export const getAllContainers = async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
};

export const getContainerById = async (id) => {
    const response = await axios.get(`${API_URL}/get-by-id/${id}`, getAuthHeaders());
    return response.data;
};

export const deleteContainer = async (id) => {
    await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
};

export const setProductToContainer = async (containerId, productId) => {
    await axios.put(`${API_URL}/set-content/${containerId}`, { productId }, getAuthHeaders());
};

export const updateContainer = async (id, tareData) => {
    await axios.put(`${API_URL}/update/${id}`, tareData, getAuthHeaders());
};

export const clearProductFromTare = async (containerId) => {
    await axios.put(`${API_URL}/clear-content/${containerId}`, {}, getAuthHeaders());
};