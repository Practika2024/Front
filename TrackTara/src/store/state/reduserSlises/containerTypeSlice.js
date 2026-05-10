import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const containerTypeSlice = createSlice({
  name: "containerTypes",
  initialState,
  reducers: {
    getAll: (state, action) => {
      state.list = action.payload;
    },
    addType: (state, action) => {
      state.list.push(action.payload);
    },
    updateType: (state, action) => {
      const idx = state.list.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deleteType: (state, action) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { getAll, addType, updateType, deleteType, setLoading, setError } =
  containerTypeSlice.actions;
export default containerTypeSlice.reducer;
