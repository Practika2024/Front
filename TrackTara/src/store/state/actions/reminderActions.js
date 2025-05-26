import { toast } from "react-toastify";
import { ReminderService } from "../../../utils/services/ReminderService";
import { setReminders, deleteReminderSlice } from "../reduserSlises/remindersSlice";

export const getAllReminders = () => async (dispatch) => {
    try {
        const response = await ReminderService.getAll();
        console.log('getAllReminders response:', response);
        dispatch(setReminders(response.payload));
    } catch (error) {
        toast.error(error.response?.data || "Failed to load reminders.");
    }
};

export const getReminderById = async (reminderId) => {
    try {
        const response = await ReminderService.getById(reminderId);
        return response.payload;
    } catch (error) {
        toast.error(error.response?.data || "Reminder not found.");
    }
};

export const addReminder = (containerId, model) => async () => {
    try {
        await ReminderService.add(containerId, model);
        toast.success("Reminder added successfully.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to add reminder.");
    }
};

export const updateReminder = (reminderId, model) => async () => {
    try {
        await ReminderService.update(reminderId, model);
        toast.success("Reminder updated successfully.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to update reminder.");
    }
};

export const deleteReminder = (reminderId) => async (dispatch) => {
    try {
        await ReminderService.delete(reminderId);
        dispatch(deleteReminderSlice(reminderId));
        toast.success("Reminder deleted.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to delete reminder.");
    }
};

export const getRemindersByUser = () => async (dispatch) => {
    try {
        const response = await ReminderService.getAllByUser();
        dispatch(setReminders(response.payload));
    } catch (error) {
        toast.error(error.response?.data || "Failed to load user reminders.");
    }
};

export const getNotCompletedReminders = () => async (dispatch) => {
    try {
        const response = await ReminderService.getNotCompletedByUser();
        console.log('getNotCompletedReminders response:', response);
        dispatch(setReminders(response.payload));
    } catch (error) {
        toast.error(error.response?.data || "Failed to load not completed reminders.");
    }
};

export const getCompletedReminders = () => async (dispatch) => {
    try {
        const response = await ReminderService.getAllCompletedByUser();
        console.log('getCompletedReminders response:', response);
        dispatch(setReminders(response.payload));
    } catch (error) {
        toast.error(error.response?.data || "Failed to load completed reminders.");
    }
};

export const getNotViewedReminders = () => async (dispatch) => {
    try {
        const response = await ReminderService.getNotViewedByUser();
        dispatch(setReminders(response.payload));
    } catch (error) {
        toast.error(error.response?.data || "Failed to load not viewed reminders.");
    }
};

export const getAllReminderTypes = async () => {
    try {
        const response = await ReminderService.getAllTypes();
        return response.payload;
    } catch (error) {
        toast.error(error.response?.data || "Failed to load reminder types.");
    }
};

export const addReminderType = (model) => async () => {
    try {
        await ReminderService.addType(model);
        toast.success("Reminder type added successfully.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to add reminder type.");
    }
};

export const updateReminderType = (typeId, model) => async () => {
    try {
        await ReminderService.updateType(typeId, model);
        toast.success("Reminder type updated successfully.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to update reminder type.");
    }
};

export const deleteReminderType = (typeId) => async () => {
    try {
        await ReminderService.deleteType(typeId);
        toast.success("Reminder type deleted.");
    } catch (error) {
        toast.error(error.response?.data || "Failed to delete reminder type.");
    }
};
