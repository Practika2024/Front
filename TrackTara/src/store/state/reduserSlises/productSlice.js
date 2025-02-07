import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
  product : null,
  productWithoutImagesForEdit: null,
  imagesForEdit: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getAll: (state, action) => {
      state.productList = action.payload;
    },

    getFilterProducts: (state, action) => {
        state.productList = action.payload;
    },

    getProductsByCategory: (state, action) => {
      state.productList = action.payload;
    },

    getProduct: (state, action) => {
      state.product = action.payload;
    },

    getProductForEdit: (state, action) => {
      const { images, ...rest } = action.payload;
      state.productWithoutImagesForEdit = rest;
      state.imagesForEdit = images || [];
    },

    updateImageForProduct: (state, action) => {
        state.imagesForEdit = action.payload || [];
    },

    updateImage: (state, action) => {
      state.imagesForEdit = action.payload;
    },

    addProduct: (state, action) => {
      state.productList = [...state.productList, action.payload];
    },

    deleteProductReduser: (state, action) => {
      state.productList = state.productList.filter(
        (m) => m.id !== action.payload.id
      );
    },

    updateProductReducer: (state, action) => {
      const index = state.productList.findIndex(
        (m) => m.id === action.payload.id
      );
      if (index !== -1) {
        state.productList[index] = action.payload;
      }
    },
  },
});

export const {
  getAll,
  getFilterProducts,
  addProduct,
  deleteProductReduser,
  updateProductReducer,
  getProductsByCategory,
  getProduct,
  getProductForEdit,
  updateImageForProduct,
} = productSlice.actions;
export default productSlice.reducer;
