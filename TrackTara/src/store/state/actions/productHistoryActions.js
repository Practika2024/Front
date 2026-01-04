// src/store/actions/productHistoryActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProductHistories, getProductHistoryById } from '../../../utils/services';

export const fetchAllProductHistories = createAsyncThunk(
    'productHistory/fetchAll',
    async (productId, { rejectWithValue }) => {
        try {
            const data = await getAllProductHistories(productId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProductHistoryById = createAsyncThunk(
    'productHistory/fetchById',
    async (productHistoryId, { rejectWithValue }) => {
        try {
            const data = await getProductHistoryById(productHistoryId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

