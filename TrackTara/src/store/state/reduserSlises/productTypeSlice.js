// src/store/state/reducers/productTypeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    productTypes: [],
    loading: false,
    error: null,
};

const productTypeSlice = createSlice({
    name: 'productTypes',
    initialState,
    reducers: {
        getAll: (state, action) => {
            state.productTypes = action.payload;
        },
        addType: (state, action) => {
            state.productTypes.push(action.payload);
        },
        updateType: (state, action) => {
            const index = state.productTypes.findIndex(type => type.id === action.payload.id);
            if (index !== -1) {
                state.productTypes[index] = action.payload;
            }
        },
        deleteType: (state, action) => {
            state.productTypes = state.productTypes.filter(type => type.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { getAll, addType, updateType, deleteType, setLoading, setError } = productTypeSlice.actions;
export default productTypeSlice.reducer;