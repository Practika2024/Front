import { createSlice } from "@reduxjs/toolkit";

const MAX_PRICE_VAL = 50000;
const MAX_STOCK_QUANTITY = 100;

const initialState = {
  categoryId: "",
  manufacturerIds: [],
  name: "",
  minPrice: 0,
  maxPrice: MAX_PRICE_VAL,
  minStockQuantity: 0,
  maxStockQuantity: MAX_STOCK_QUANTITY,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategoryId: (state, action) => {
      state.categoryId = action.payload;
    },
    setManufacturerIds: (state, action) => {
      state.manufacturerIds = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setMinStockQuantity: (state, action) => {
      state.minStockQuantity = action.payload;
    },
    setMaxStockQuantity: (state, action) => {
      state.maxStockQuantity = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setCategoryId,
  setManufacturerIds,
  setName,
  setMinPrice,
  setMaxPrice,
  setMinStockQuantity,
  setMaxStockQuantity,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
