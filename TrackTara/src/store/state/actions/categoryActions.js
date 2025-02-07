import { CategoryService } from "../../../utils/services/CategoryService";
import {
  getAll
} from "../reduserSlises/categorySlice";

export const getCategories = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    CategoryService.setAuthorizationToken(token);

    const res = await CategoryService.getCategories();

    dispatch(getAll(res));
  } catch (error) {
    console.error("Get Categories failed", error);
  }
};
