import { getAllProducts } from '../../../utils/services/productService';
import { getAll } from './../reduserSlises/productSlice';

export const fetchProducts = () => async (dispatch) => {
  try {
    const response = await getAllProducts();
    dispatch(getAll(response));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};