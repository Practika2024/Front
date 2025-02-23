import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  apiRequestIsLoading: false,
};

export const appSettingSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setApiRequestLoading: (state, action) => {
      state.apiRequestIsLoading = action.payload;
    },
  },
});

export const { setApiRequestLoading } = appSettingSlice.actions;
export default appSettingSlice.reducer;

