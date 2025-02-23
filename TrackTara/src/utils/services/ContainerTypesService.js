// src/utils/services/ContainerTypesService.js
import axios from 'axios';

const API_URL = 'http://localhost:5081/containers-type';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getAllContainerTypes = async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
};

export const createContainerType = async (typeData) => {
    await axios.post(`${API_URL}/add`, typeData, getAuthHeaders());
};

export const getContainerTypeNameById = async (id) => {
    const containerTypes = await getAllContainerTypes();
    const type = containerTypes.find(type => type.id === id);
    return type ? type.name : 'Unknown';
};

export const updateContainerType = async (id, typeData) => {
    await axios.put(`${API_URL}/update/${id}`, typeData, getAuthHeaders());
};

export const deleteContainerType = async (id) => {
    await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
};