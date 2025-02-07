import React, { memo } from "react";
import ImageItem from "./ImageItem";
import { useSelector } from "react-redux";
import productImage from "../../../../../hooks/productImage";

const ImageList = () => {
  const images = useSelector((state) => state.product.imagesForEdit);
  return (
    <div>
      {images.length === 0 ? (
        <img
          height="200"
          alt="Product Image"
          loading="lazy"
          src={productImage(undefined)}
        />
      ) : (
        <div className="d-flex gap-3 flex-wrap">
          {images.map((image) => (
            <ImageItem key={image.id} image={image} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageList;
