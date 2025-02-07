import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  manufacturerList: [],
};

export const manufacturerSlice = createSlice({
  name: "manufacturer",
  initialState,
  reducers: {
    getAll: (state, action) => {
      state.manufacturerList = action.payload;
    },
    addManufacturer: (state, action) => {
      state.manufacturerList = [...state.manufacturerList, action.payload];
    },
    deleteManufacturerReduser: (state, action) => {
      state.manufacturerList = state.manufacturerList.filter(
        (m) => m.id !== action.payload.id
      );
    },
    updateManufacturerReducer: (state, action) => {
      const index = state.manufacturerList.findIndex(
        (m) => m.id === action.payload.id
      );
      if (index !== -1) {
        state.manufacturerList[index] = action.payload;
      }
    },
  },
});

export const {
  getAll,
  addManufacturer,
  deleteManufacturerReduser,
  updateManufacturerReducer,
} = manufacturerSlice.actions;
export default manufacturerSlice.reducer;
