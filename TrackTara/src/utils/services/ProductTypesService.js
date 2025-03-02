// src/utils/services/ProductTypesService.js
import axios from 'axios';
import  REMOTE_HOST_NAME  from "../../env/index";
const API_URL = REMOTE_HOST_NAME + 'products-type';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getAllProductTypes = async () => {
    const response = await axios.get(`${API_URL}/get-all`, getAuthHeaders());
    return response.data;
};

export const addProductType = async (productType) => {
    const response = await axios.post(`${API_URL}/add`, productType, getAuthHeaders());
    return response.data;
};

export const updateProductType = async (id, productType) => {
    const response = await axios.put(`${API_URL}/update/${id}`, productType, getAuthHeaders());
    return response.data;
};

export const deleteProductType = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    return response.data;
};