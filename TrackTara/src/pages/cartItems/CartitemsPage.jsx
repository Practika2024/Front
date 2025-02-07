import { Typography } from "@mui/material";
import React, { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import useActions from "../../hooks/useActions";
import { useRenderCount } from "../../hooks/useRenderCount";
import CartItemCard from "./components/CartItemCard";

const MemoizedTypography = memo(Typography);

const CartItemsPage = () => {
  const cartItems = useSelector((state) => state.cartItem.cartItemList);
  const userId = useSelector((state) => state.user.currentUser?.id);
  const { getCartItemsByUserId } = useActions();

  useEffect(() => {
    if (userId) {
      getCartItemsByUserId(userId);
    }
  }, [userId]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const renderCount = useRenderCount();

  return (
    <div className="container">
      {/* Вивід загальної ціни */}
      <div className="float-end d-flex gap-2">
        <MemoizedTypography variant="h6">Total price:</MemoizedTypography>
        <Typography variant="h6" sx={{ color: "red" }}>
          {totalPrice.toFixed(2)}$
        </Typography>
      </div>
      <MemoizedTypography variant="h4" gutterBottom>
        Your Cart
      </MemoizedTypography>

      {/* Відображення товарів у кошику */}
      {cartItems.length > 0 ? (
        cartItems.map((item) => <CartItemCard cartItem={item} key={item.id} />)
      ) : (
        <Typography variant="h6" color="text.secondary">
          Your cart is empty!
        </Typography>
      )}
      {/* <h5>render {renderCount}</h5> */}
    </div>
  );
};

export default CartItemsPage;
