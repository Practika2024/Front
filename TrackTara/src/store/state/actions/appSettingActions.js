import { setApiRequestLoading } from "../reduserSlises/appSettingSlice";

export const setIsLoading = (isLoading) => async (dispatch) => {
  try {
    dispatch(setApiRequestLoading(isLoading));
  } catch (error) {
    console.error("Error setting loading:", error);
  }
};
