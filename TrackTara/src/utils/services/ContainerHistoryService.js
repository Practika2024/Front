// src/utils/services/ContainerHistoryService.js
import axios from 'axios';
import  REMOTE_HOST_NAME  from "../../env/index";

const API_URL = REMOTE_HOST_NAME + 'containers-history';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getAllContainerHistories = async (containerId) => {
    const response = await axios.get(`${API_URL}?containerId=${containerId}`, getAuthHeaders());
    return response.data;
};

export const getContainerHistoryById = async (containerHistoryId) => {
    const response = await axios.get(`${API_URL}/get-by-id/${containerHistoryId}`, getAuthHeaders());
    return response.data;
};