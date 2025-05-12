import { toast } from "react-toastify";
import { ReminderService } from "../../../utils/services/ReminderService";
import { setReminders, deleteReminderSlice } from "../reduserSlises/remindersSlice";

export const getAllReminders = () => async (dispatch) => {
    try {
        const response = await ReminderService.getAll();
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
