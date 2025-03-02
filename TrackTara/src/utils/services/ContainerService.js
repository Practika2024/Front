// src/utils/services/ContainerService.js
import axios from 'axios';
import  REMOTE_HOST_NAME  from "../../env/index";
const API_URL = REMOTE_HOST_NAME + 'containers';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const createContainer = async (containerData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, containerData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error creating container:', error);
        throw error;
    }
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
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, tareData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error updating container:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const clearProductFromTare = async (containerId) => {
    await axios.put(`${API_URL}/clear-content/${containerId}`, {}, getAuthHeaders());
};