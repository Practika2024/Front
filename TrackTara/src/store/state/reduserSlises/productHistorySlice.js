// src/store/slices/productHistorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllProductHistories, fetchProductHistoryById } from '../actions/productHistoryActions';

const productHistorySlice = createSlice({
    name: 'productHistory',
    initialState: {
        histories: [],
        history: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProductHistories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProductHistories.fulfilled, (state, action) => {
                state.loading = false;
                state.histories = action.payload;
            })
            .addCase(fetchAllProductHistories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductHistoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductHistoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchProductHistoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productHistorySlice.reducer;

