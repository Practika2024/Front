import { createSlice } from '@reduxjs/toolkit';
import { fetchReminderTypes, createReminderType, updateReminderTypeThunk, deleteReminderTypeThunk } from '../actions/reminderTypeActions';

const initialState = {
    items: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        pageSize: 10,
        total: 0
    }
};

const reminderTypesSlice = createSlice({
    name: 'reminderTypes',
    initialState,
    reducers: {
        setReminderTypes: (state, action) => {
            console.log('Setting reminder types:', action.payload);
            state.items = action.payload.items;
            state.pagination = action.payload.pagination;
        },
        addReminderType: (state, action) => {
            console.log('Adding reminder type:', action.payload);
            state.items.push(action.payload);
        },
        updateReminderType: (state, action) => {
            console.log('Updating reminder type:', action.payload);
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteReminderType: (state, action) => {
            console.log('Deleting reminder type:', action.payload);
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchReminderTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReminderTypes.fulfilled, (state, action) => {
                console.log('Fetch fulfilled:', action.payload);
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchReminderTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create
            .addCase(createReminderType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReminderType.fulfilled, (state, action) => {
                console.log('Create fulfilled:', action.payload);
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createReminderType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update
            .addCase(updateReminderTypeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReminderTypeThunk.fulfilled, (state, action) => {
                console.log('Update fulfilled:', action.payload);
                state.loading = false;
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateReminderTypeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete
            .addCase(deleteReminderTypeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReminderTypeThunk.fulfilled, (state, action) => {
                console.log('Delete fulfilled:', action.payload);
                state.loading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteReminderTypeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const {
    setReminderTypes,
    addReminderType,
    updateReminderType,
    deleteReminderType,
    setLoading,
    setError
} = reminderTypesSlice.actions;

export default reminderTypesSlice.reducer; 