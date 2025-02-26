import { getAll, deleteTareSlice, setProduct, clearProduct, setLoading, setError } from '../reduserSlises/containerSlice';
import { getAllContainers, deleteContainer, setProductToContainer, clearProductFromTare } from '../../../utils/services/ContainerService';
import { getContainerTypeNameById } from '../../../utils/services/ContainerTypesService';

//
export const fetchContainers = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await getAllContainers();
        dispatch(getAll(response));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};
export const fetchContainerTypeNameById = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const name = await getContainerTypeNameById(id);
        console.log('Fetched container type name:', name);
        return name;
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};


export const removeContainer = (id) => async (dispatch) => {
    try {
        await deleteContainer(id);
        dispatch(deleteTareSlice(id));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const addProductToContainer = (containerId, productId) => async (dispatch) => {
    try {
        await setProductToContainer(containerId, productId);
        dispatch(setProduct({ containerId, productId }));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const removeProductFromContainer = (containerId) => async (dispatch) => {
    try {
        await clearProductFromTare(containerId);
        dispatch(clearProduct(containerId));
    } catch (error) {
        dispatch(setError(error.message));
    }
};
