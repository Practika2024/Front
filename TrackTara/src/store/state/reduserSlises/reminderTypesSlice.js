import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reminderTypes: [],
};

export const reminderTypesSlice = createSlice({
    name: "reminderTypes",
    initialState,
    reducers: {
        setReminderTypes: (state, action) => {
            state.reminderTypes = action.payload;
        },
        addReminderType: (state, action) => {
            state.reminderTypes.push(action.payload);
        },
        updateReminderType: (state, action) => {
            const index = state.reminderTypes.findIndex(type => type.id === action.payload.id);
            if (index !== -1) {
                state.reminderTypes[index] = action.payload;
            }
        },
        deleteReminderType: (state, action) => {
            state.reminderTypes = state.reminderTypes.filter(type => type.id !== action.payload);
        },
    },
});

export const {
    setReminderTypes,
    addReminderType,
    updateReminderType,
    deleteReminderType,
} = reminderTypesSlice.actions;

export default reminderTypesSlice.reducer; 