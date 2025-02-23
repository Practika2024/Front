import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    containers: [],
    loading: false,
    error: null,
};

const containerSlice = createSlice({
    name: 'containers',
    initialState,
    reducers: {
        getAll: (state, action) => {
            state.containers = action.payload;
            state.loading = false;
        },
        deleteTareSlice: (state, action) => {
            state.containers = state.containers.filter(container => container.id !== action.payload);
        },
        setProduct: (state, action) => {
            const { containerId, productId } = action.payload;
            const container = state.containers.find(container => container.id === containerId);
            if (container) container.productId = productId;
        },
        clearProduct: (state, action) => {
            const container = state.containers.find(container => container.id === action.payload);
            if (container) container.productId = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { getAll, deleteTareSlice, setProduct, clearProduct, setLoading, setError } = containerSlice.actions;
export default containerSlice.reducer;
