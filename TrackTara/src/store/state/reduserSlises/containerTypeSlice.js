import { createSlice } from '@reduxjs/toolkit';



const containerTypeSlice = createSlice({
    name: 'containerTypes',
    reducers: {
        getAll: (state, action) => {
            state.containerTypes = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { getAll, setLoading, setError } = containerTypeSlice.actions;
export default containerTypeSlice.reducer;