import { setApiRequestLoading, setPageStatus } from "../reduserSlises/appSettingSlice";

export const setIsLoading = (isLoading) => async (dispatch) => {
  try {
    dispatch(setApiRequestLoading(isLoading));
  } catch (error) {
    console.error("Error setting loading:", error);
  }
};
export const setStatus =
  (status) => async (dispatch) => {
    try {
      dispatch(setPageStatus(status));
    } catch (error) {
    console.error("Error setting status:", error);
    }
  };