import { getAllContainers, deleteContainer, setProductToContainer, clearProductFromTare } from '../../../utils/services/ContainerService.js';
import { getAll, deleteTareSlice, setProduct, clearProduct } from './../reduserSlises/containerSlice';

export const fetchContainers = () => async (dispatch) => {
    try {
        const response = await getAllContainers();
        dispatch(getAll(response));
    } catch (error) {
        console.error('Error fetching containers:', error);
    }
};

export const removeContainer = (id) => async (dispatch) => {
    try {
        await deleteContainer(id);
        dispatch(deleteTareSlice(id));
    } catch (error) {
        console.error('Error deleting container:', error);
    }
};

export const addProductToContainer = (containerId, productId) => async (dispatch) => {
    try {
        await setProductToContainer(containerId, productId);
        dispatch(setProduct({ containerId, productId }));
    } catch (error) {
        console.error('Error adding product to container:', error);
    }
};

export const removeProductFromContainer = (containerId) => async (dispatch) => {
    try {
        await clearProductFromTare(containerId);
        dispatch(clearProduct(containerId));
    } catch (error) {
        console.error('Error clearing product from container:', error);
    }
};