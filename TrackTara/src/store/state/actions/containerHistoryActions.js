// src/store/actions/containerHistoryActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllContainerHistories, getContainerHistoryById } from '../../../utils/services/ContainerHistoryService';

export const fetchAllContainerHistories = createAsyncThunk(
    'containerHistory/fetchAll',
    async (containerId, { rejectWithValue }) => {
        try {
            const data = await getAllContainerHistories(containerId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchContainerHistoryById = createAsyncThunk(
    'containerHistory/fetchById',
    async (containerHistoryId, { rejectWithValue }) => {
        try {
            const data = await getContainerHistoryById(containerHistoryId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);