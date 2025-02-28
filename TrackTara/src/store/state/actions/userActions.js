import {
  authUser,
  logout,
  getAllFavoriteProducts,
  addFavoriteProduct,
  removeFavoriteProduct,
} from "./../reduserSlises/userSlice";
import { deleteUserSlice, getAll } from "./../reduserSlises/usersSlice";
import { AuthService } from "../../../utils/services/AuthService";
import { UserService } from "../../../utils/services/UserService";
import { jwtDecode } from "jwt-decode";
import { getCartItemsByUserId } from "./cartItemActions";

export const signInUser = (model) => async (dispatch) => {
  try {
    const response = await AuthService.signIn(model);
    await AuthByToken(response)(dispatch);
    return { success: true, message: "You login successfuly!" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};
export const externalLoginUser = (model) => async (dispatch) => {
  try {
    const response = await AuthService.externalLogin(model);
    await AuthByToken(response)(dispatch);
    return { success: true, message: "You login successfuly!" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};

export const AuthByToken = (tokens) => async (dispatch) => {
  if (tokens) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);

    await AuthService.setAuthorizationToken(tokens.accessToken);
    const user = jwtDecode(tokens.accessToken);

    if (
      Array.isArray(user?.role)
        ? user?.role.includes("User")
        : user?.role === "User"
    ) {
      await loadFavoriteProducts(user.id)(dispatch);
      await getCartItemsByUserId(user.id)(dispatch);
    }

    dispatch(authUser(user));
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    await AuthService.setAuthorizationToken(null);
  }
};

export const signUpUser = (model) => async (dispatch) => {
  try {
    const response = await AuthService.signUp(model);

    const tokens = response;

    await AuthByToken(tokens)(dispatch);

    return { success: true, message: response.message };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};

export const logoutUser = () => async (dispatch) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  await AuthService.setAuthorizationToken(null);
  dispatch(logout());
};

export const getUsers = () => async (dispatch) => {
  try {
    const response = await UserService.getUsers();

    dispatch(getAll(response));

    return { success: true, message: "get users success" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    await UserService.delete(userId);

    dispatch(deleteUserSlice(userId));

    return { success: true, message: "delete users success" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};

export const changeRoles = (userId, roles) => async (dispatch) => {
  try {
    const response = await UserService.changeRoles(userId, roles);

    return { success: true, message: "User roles updated successfully" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};

export const uploadImage = (userId, file) => async (dispatch) => {
  try {
    const response = await UserService.uploadImage(userId, file);

    await AuthByToken(response)(dispatch);

    return { success: true, message: "Image saved!" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};
export const createUser = (model) => async (dispatch) => {
  try {
    const response = await UserService.createUser(model);
    dispatch(getUsers()); // Refresh the user list after creating a new user
    return { success: true, message: "User created successfully" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};
export const updateUser = (userId, model) => async (dispatch) => {
  try {
    const response = await UserService.updateUser(userId, model);

    await AuthByToken(response)(dispatch);

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};

export const loadFavoriteProducts = (userId) => async (dispatch) => {
  try {
    UserService.setAuthorizationToken(localStorage.getItem("accessToken"));

    const response = await UserService.getFavoriteProducts(userId);
    dispatch(getAllFavoriteProducts(response));
  } catch (error) {
    const errorMessage = error.response?.data;
    console.error("Error loading favorite products:", errorMessage);
    return { success: false, message: errorMessage };
  }
};

export const addProductToFavorites =
  (userId, productId) => async (dispatch) => {
    try {
      await UserService.addFavoriteProduct(userId, productId);
      dispatch(addFavoriteProduct(productId));
      await loadFavoriteProducts(userId)(dispatch);
      return { success: true, message: "Product added to favorites" };
    } catch (error) {
      const errorMessage = error.response?.data;
      return { success: false, message: errorMessage };
    }
  };

export const removeProductFromFavorites =
  (userId, productId) => async (dispatch) => {
    try {
      await UserService.removeFavoriteProduct(userId, productId);
      dispatch(removeFavoriteProduct(productId));
      return { success: true, message: "Product removed from favorites" };
    } catch (error) {
      const errorMessage = error.response?.data;
      return { success: false, message: errorMessage };
    }
  };
