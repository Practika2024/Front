// src/store/actions/productActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductService } from '../../../utils/services/ProductService';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await ProductService.getAll();
  return response;
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id) => {
  const response = await ProductService.getById(id);
  return response;
});

export const addProduct = createAsyncThunk('products/add', async (product) => {
  const response = await ProductService.addProduct(product);
  return response;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  const response = await ProductService.deleteProduct(id);
  return response;
});