import { getRoles } from "./../reduserSlises/roleSlice";
import { RoleService } from "../../../utils/services/RoleService";
import { toast } from "react-toastify";

export const getRolesData = () => async (dispatch) => {
  try {
    const response = await RoleService.getRoles();

    dispatch(getRoles(response));

    return { success: true, message: "get roles success" };
  } catch (error) {
    toast.error(errorMessage)
  }
};
