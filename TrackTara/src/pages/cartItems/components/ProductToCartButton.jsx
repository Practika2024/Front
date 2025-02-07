import React, { memo, useEffect, useState, useCallback } from 'react';
import { FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useActions from '../../../hooks/useActions';
import { IconButton } from '@mui/material';
import CartItemModal from '../cartItemsModals/CartItemModal';

const ProductToCartButton = memo(({ productId }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const cartItems = useSelector((state) => state.cartItem.cartItemList)
  const userId = useSelector((state) => state.user.currentUser?.id)
  const { createCartItem } = useActions()
  const navigate = useNavigate()

  useEffect(() => {
    if (cartItems && userId) {
      const isProductInCart = cartItems.some(
        (item) => item.productId === productId && item.userId === userId
      );
      setIsInCart(isProductInCart);
    }
  }, [])

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  const handleAddToCart = useCallback(() => {
    if (isInCart) {
      openModal();
    } else {
      const cartItem = { productId, userId, quantity: 1 };
      createCartItem(cartItem).then((response) => {
        if (response.success) {
          toast.success('Product added to cart!');
          setIsInCart(true);
        } else {
          toast.error(response.message);
        }
      });
    }
  }, [isInCart, productId]);

  const handleGoToCart = useCallback(() => {
    closeModal();
    navigate('/cartItems');
  }, [closeModal, navigate]);

  return (
    <div>
      <IconButton onClick={handleAddToCart}>
        {isInCart ? (
          <FaCheckCircle size={24} color="green" title="In Cart" />
        ) : (
          <FaShoppingCart size={24} color="gray" title="Add to Cart" />
        )}
      </IconButton>

      <CartItemModal open={showModal} onClose={closeModal} onGoToCart={handleGoToCart} />
    </div>
  );
});

export default ProductToCartButton;
