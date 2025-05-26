import { toast } from "react-toastify";
import { ReminderTypeService } from "../../../utils/services/ReminderTypeService";
import {
    setReminderTypes,
    addReminderType,
    updateReminderType,
    deleteReminderType,
} from "../reduserSlises/reminderTypesSlice";

export const getAllReminderTypes = () => async (dispatch) => {
    try {
        const response = await ReminderTypeService.getAll();
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