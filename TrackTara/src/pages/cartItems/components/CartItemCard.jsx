import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Card,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import useActions from "../../../hooks/useActions";
import { useRenderCount } from "../../../hooks/useRenderCount";
import ProductImage from "../../products/components/productCards/components/ProductImage";
import DeleteCartItemModal from "../cartItemsModals/DeleteCartItemModal";
import InfoAboutProduct from "./InfoAboutProduct";

const CartItemCard = ({ cartItem }) => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const openDeleteModal = useCallback((id) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const { updateCartItem } = useActions();

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      const result = await updateCartItem(item.id, newQuantity);

      if (!result.success) {
        toast.error(`Error: ${result.message}`);
      }
    }
  };

  const renderCount = useRenderCount();

  return (
    <div>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          marginBottom: 2,
          boxShadow: 3,
        }}
      >
        <ProductImage images={cartItem.product.images} />

        {/* Інформація про товар */}
        <InfoAboutProduct
          producId={cartItem.product.id}
          productName={cartItem.product.name}
          ManufacturerName={cartItem.product.manufacturer.name}
          categoryName={cartItem.product.category.name}
        />

        {/* Кількість товару */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => handleQuantityChange(cartItem, -1)}
            size="small"
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={cartItem.quantity}
            size="small"
            sx={{ width: 50, textAlign: "center", mx: 1 }}
            inputProps={{ readOnly: true }}
          />
          <IconButton
            onClick={() => handleQuantityChange(cartItem, 1)}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Ціна товару */}
        <Typography
          variant="h6"
          sx={{ color: "red", marginLeft: 2, minWidth: 80 }}
        >
          {(cartItem.product.price * cartItem.quantity).toFixed(2)} $
        </Typography>

        {/* Видалення товару */}
        <IconButton onClick={() => openDeleteModal(cartItem.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </Card>
      {/* <h5>renderCount: {renderCount}</h5> */}

      <DeleteCartItemModal
        showModal={showDeleteModal}
        closeModal={closeDeleteModal}
        cartItemId={selectedProductId}
      />
    </div>
  );
};

export default memo(CartItemCard);
