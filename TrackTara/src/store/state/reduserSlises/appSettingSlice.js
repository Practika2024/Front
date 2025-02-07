import { createSlice } from "@reduxjs/toolkit";

const PageStatuses = {
  GOOD: 0,
  NOT_FOUND: 1,
  BAD_REQUEST: 2,
  TOO_MANY_REQUESTS: 3,
};

const initialState = {
  pageStatus: PageStatuses.GOOD,
  apiRequestIsLoading: false,
};

export const appSettingSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setPageStatus: (state, action) => {
      state.pageStatus = action.payload;      
    },
    setApiRequestLoading: (state, action) => {
      state.apiRequestIsLoading = action.payload;
    },
  },
});

export const { setPageStatus, setApiRequestLoading } = appSettingSlice.actions;
export default appSettingSlice.reducer;

export { PageStatuses };
