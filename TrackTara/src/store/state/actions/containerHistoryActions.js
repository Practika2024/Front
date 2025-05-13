// src/store/actions/containerHistoryActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllContainerHistories, getContainerHistoryById } from '../../../utils/services/ContainerHistoryService';

export const fetchAllContainerHistories = createAsyncThunk(
    'containerHistory/fetchAll',
    async (containerId, { rejectWithValue }) => {
        try {
            const data = await getAllContainerHistories(containerId);
            console.log("API Response:", data); // Логування для перевірки
            return data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchContainerHistoryById = createAsyncThunk(
    'containerHistory/fetchById',
    async (containerHistoryId, { rejectWithValue }) => {
        try {
            const data = await getContainerHistoryById(containerHistoryId);
            return data.payload;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);