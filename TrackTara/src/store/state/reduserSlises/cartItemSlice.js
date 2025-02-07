import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItemList: [],
};

export const cartItemSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {

    getAllCartItems: (state, action) => {
      state.cartItemList = action.payload;
    },

    getCartItemsByUserId: (state, action) => {
      state.cartItemList = action.payload;
    },

    addCartItem: (state, action) => {
      state.cartItemList = [...state.cartItemList, action.payload];
    },

    updateCartItemQuantity: (state, action) => {
      const index = state.cartItemList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.cartItemList[index].quantity = action.payload.quantity;
      }
    },

    deleteCartItem: (state, action) => {
      state.cartItemList = state.cartItemList.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const {
  getAllCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItemsByUserId,
} = cartItemSlice.actions;
export default cartItemSlice.reducer;
