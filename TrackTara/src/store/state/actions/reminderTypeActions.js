import { toast } from "react-toastify";
import { ReminderTypeService } from "../../../utils/services/ReminderTypeService";
import {
    setReminderTypes,
    addReminderType,
    updateReminderType,
    deleteReminderType,
} from "../reduserSlises/reminderTypesSlice";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllReminderTypes = (page, pageSize) => async (dispatch) => {
    try {
        const response = await ReminderTypeService.getAll(page, pageSize);
        dispatch(setReminderTypes(response.payload));
    } catch (error) {
        toast.error(error.response?.data || "Failed to load reminder types.");
    }
};

export const getReminderTypeById = async (typeId) => {
    try {
        const response = await ReminderTypeService.getById(typeId);
        return response.payload;
    } catch (error) {
        toast.error(error.response?.data || "Reminder type not found.");
    }
};

export const addReminderTypeAction = (model) => async (dispatch) => {
    try {
        const response = await ReminderTypeService.add(model);
        dispatch(addReminderType(response.payload));
        toast.success("Reminder type added successfully.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to add reminder type.");
    }
};

export const updateReminderTypeAction = (typeId, model) => async (dispatch) => {
    try {
        const response = await ReminderTypeService.update(typeId, model);
        dispatch(updateReminderType(response.payload));
        toast.success("Reminder type updated successfully.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to update reminder type.");
    }
};

export const deleteReminderTypeAction = (typeId) => async (dispatch) => {
    try {
        await ReminderTypeService.delete(typeId);
        dispatch(deleteReminderType(typeId));
        toast.success("Reminder type deleted successfully.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to delete reminder type.");
    }
}; 

export const fetchReminderTypes = createAsyncThunk(
  'reminderTypes/fetchAll',
  async () => {
    console.log('Fetching reminder types...');
    const response = await ReminderTypeService.getAll();
    console.log('API Response:', response);
    console.log('Payload:', response.payload);
    return response.payload;
  }
);

export const createReminderType = createAsyncThunk(
  'reminderTypes/create',
  async (reminderType) => {
    console.log('Creating reminder type:', reminderType);
    const response = await ReminderTypeService.add(reminderType);
    console.log('Create Response:', response);
    console.log('Create Payload:', response.payload);
    return response.payload;
  }
);

export const updateReminderTypeThunk = createAsyncThunk(
  'reminderTypes/update',
  async ({ id, ...reminderType }) => {
    console.log('Updating reminder type:', { id, ...reminderType });
    const response = await ReminderTypeService.update(id, reminderType);
    console.log('Update Response:', response);
    console.log('Update Payload:', response.payload);
    return response.payload;
  }
);

export const deleteReminderTypeThunk = createAsyncThunk(
  'reminderTypes/delete',
  async (id) => {
    console.log('Deleting reminder type with id:', id);
    await ReminderTypeService.delete(id);
    return id;
  }
); 