// src/store/slices/containerHistorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllContainerHistories, fetchContainerHistoryById } from '../actions/containerHistoryActions';

const containerHistorySlice = createSlice({
    name: 'containerHistory',
    initialState: {
        histories: [],
        history: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllContainerHistories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllContainerHistories.fulfilled, (state, action) => {
                state.loading = false;
                state.histories = action.payload;
            })
            .addCase(fetchAllContainerHistories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchContainerHistoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContainerHistoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchContainerHistoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default containerHistorySlice.reducer;