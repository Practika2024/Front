// src/utils/services/ContainerTypesService.js
import axios from 'axios';
import  REMOTE_HOST_NAME  from "../../env/index";

const API_URL = REMOTE_HOST_NAME + 'containers-type';

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
    const response = await axios.post(`${API_URL}/add`, typeData, getAuthHeaders());
    return response.data; // Повертаємо створений об'єкт
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