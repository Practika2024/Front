import { CartItemService } from "../../../utils/services/CartItemService";
import {
  getAllCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItemsByUserId as getCartItemsByUserIdSliser,
} from "../reduserSlises/cartItemSlice";

export const getCartItems = () => async (dispatch) => {
  try {
    const res = await CartItemService.getAllCartItems();

    dispatch(getAllCartItems(res));
  } catch (error) {
    console.error("Getting cart items failed", error);
  }
};

export const getCartItemsByUserId = (userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    await CartItemService.setAuthorizationToken(token);
    const res = await CartItemService.getCartItemsByUserId(userId);

    dispatch(getCartItemsByUserIdSliser(res));
  } catch (error) {
    console.error("Getting cart items failed", error);
  }
};

export const createCartItem = (cartItem) => async (dispatch) => {
  try {
    const res = await CartItemService.createCartItem(cartItem);

    dispatch(addCartItem(res));
    return { success: true, message: "Cart item added successfully" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors?.Message ||
      "An error occurred while adding the cart item";
    return { success: false, message: errorMessage };
  }
};

export const updateCartItem = (cartItemId, quantity) => async (dispatch) => {
  try {
    const res = await CartItemService.updateCartItemQuantity(
      cartItemId,
      quantity
    );

    dispatch(updateCartItemQuantity({ id: cartItemId, quantity }));
    return { success: true, message: "Cart item updated successfully" };
  } catch (error) {
    let errorMessage = "An error occurred during cart item update.";

    if (error.response) {
      if (error.response.data?.title) {
        errorMessage = error.response.data.title;
      } else if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      }
    }

    console.error("Error updating cart item:", errorMessage);
    return { success: false, message: errorMessage };
  }
};

export const deleteCartItemById = (cartItemId) => async (dispatch) => {
  try {
    await CartItemService.deleteCartItem(cartItemId);

    dispatch(deleteCartItem({ id: cartItemId }));
    return { success: true, message: "Cart item deleted successfully" };
  } catch (error) {
    console.error("Deleting cart item failed", error);
    return { success: false, message: "Failed to delete cart item" };
  }
};
