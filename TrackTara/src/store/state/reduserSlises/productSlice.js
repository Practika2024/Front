// src/store/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, addProduct, deleteProduct } from '../actions/productActions';

const initialState = {
  products: [],
  product: null,
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchProducts.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.products = action.payload;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchProductById.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProductById.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.product = action.payload;
        })
        .addCase(fetchProductById.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(addProduct.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(addProduct.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.products.push(action.payload);
        })
        .addCase(addProduct.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(deleteProduct.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.products = state.products.filter((product) => product.id !== action.payload.id);
        })
        .addCase(deleteProduct.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
  },
});

export default productSlice.reducer;
