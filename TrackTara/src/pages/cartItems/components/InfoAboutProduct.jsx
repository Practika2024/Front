import { CardContent, Typography, Link } from "@mui/material";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const InfoAboutProduct = (cartItem) => {
  const navigate = useNavigate();
  return (
    <div>
      <CardContent sx={{ flex: "1 1 auto" }}>
        <Typography variant="h6" component="div">
          <Link
            component="button"
            onClick={() => navigate(`/electronicItem/product/${cartItem.producId}`)}
          >
            {cartItem.productName}
          </Link>
        </Typography>
        <Typography color="text.secondary">
          Продавець: {cartItem.ManufacturerName || "Unknown"}
        </Typography>
        <Typography color="text.secondary">
          Категорія: {cartItem.categoryName || "Unknown"}
        </Typography>
      </CardContent>
    </div>
  );
};

export default memo(InfoAboutProduct);
