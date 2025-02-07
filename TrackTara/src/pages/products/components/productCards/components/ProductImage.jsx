import React, { memo } from "react";
import { CardMedia } from "@mui/material";
import productImage from "../../../../../hooks/productImage";

const ProductImage = ({ images }) => {
  return (
    <div className="d-flex gap-3 flex-wrap">
      {images?.length > 0 ? (
        <CardMedia
          component="img"
          height="140"
          image={productImage(images[0].filePath)}
          alt="Product image"
        />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image={productImage(undefined)}
          alt="Default product"
        />
      )}
    </div>
  );
};

export default memo(ProductImage);
