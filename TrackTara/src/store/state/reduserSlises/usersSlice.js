import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: []
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getAll: (state, action) => {
      state.userList = action.payload;
    },
    deleteUserSlice: (state, action) => {
      state.userList = state.userList.filter((u) => u.id != action.payload);
    }
  },
});

export const {
  getAll,
  deleteUserSlice
} = usersSlice.actions;

export default usersSlice.reducer;
