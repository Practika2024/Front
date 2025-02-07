import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {

    getAll: (state, action) => {
      state.categoryList = action.payload;
    }
  },
});

export const {
  getAll
} = categorySlice.actions;

export default categorySlice.reducer;
