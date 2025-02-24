import {
    createContainerType, deleteContainerType,
    getAllContainerTypes,
    getContainerTypeNameById, updateContainerType
} from '../../../utils/services/ContainerTypesService';
import { getAll, setLoading, setError } from '../reduserSlises/containerTypeSlice.js';


export const fetchContainerTypes = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const containerTypes = await getAllContainerTypes();
        console.log('Fetched container types:', containerTypes);
        dispatch(getAll(containerTypes));
    } catch (error) {
        dispatch(setError(error.toString()));
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
export const fetchTypeById = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const containerTypes = await getAllContainerTypes();
        console.log('Fetched container types:', containerTypes);
        const type = containerTypes.find(type => type.id === id);
        return type ? type.name : 'Unknown';
    } catch (error) {
        dispatch(setError(error.toString()));
    } finally {
        dispatch(setLoading(false));
    }
};
export const addNewContainerType = (typeData) => async (dispatch) => {
    try {
        const response = await createContainerType(typeData);
        dispatch(addType(response));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const updateExistingContainerType = (id, typeData) => async (dispatch) => {
    try {
        const response = await updateContainerType(id, typeData);
        dispatch(updateType(response));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const removeContainerType = (id) => async (dispatch) => {
    try {
        await deleteContainerType(id);
        dispatch(deleteType(id));
    } catch (error) {
        dispatch(setError(error.message));
    }
};