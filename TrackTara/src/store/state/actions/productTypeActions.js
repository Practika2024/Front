// src/store/state/actions/productTypeActions.js
import {
    getAllProductTypes,
    addProductType,
    updateProductType,
    deleteProductType
} from '../../../utils/services/ProductTypesService';
import { getAll, addType, updateType, deleteType, setLoading, setError } from '../reduserSlises/productTypeSlice';

export const fetchProductTypes = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const productTypes = await getAllProductTypes();
        dispatch(getAll(productTypes));
    } catch (error) {
        dispatch(setError(error.toString()));
    } finally {
        dispatch(setLoading(false));
    }
};

export const createProductType = (productType) => async (dispatch) => {
    try {
        const response = await addProductType(productType);
        dispatch(addType(response));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const modifyProductType = (id, productType) => async (dispatch) => {
    try {
        const response = await updateProductType(id, productType);
        dispatch(updateType(response));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const removeProductType = (id) => async (dispatch) => {
    try {
        await deleteProductType(id);
        dispatch(deleteType(id));
    } catch (error) {
        dispatch(setError(error.message));
    }
};