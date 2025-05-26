import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reminders: [],
    reminderTypes: [],
};

export const remindersSlice = createSlice({
    name: "reminder",
    initialState,
    reducers: {
        setReminders: (state, action) => {
            state.reminders = action.payload;
        },
        deleteReminderSlice: (state, action) => {
            state.reminders = state.reminders.filter(r => r.id !== action.payload);
        },
        setReminderTypes: (state, action) => {
            state.reminderTypes = action.payload;
        },
    },
});

export const {
    setReminders,
    deleteReminderSlice,
    setReminderTypes,
} = remindersSlice.actions;

export default remindersSlice.reducer;
