import React from "react";
import { useSelector } from "react-redux";
import NoImageProduct from "../../../../../assets/images/noImageProduct.png";
import ImageItem from "./ImageItem";

const ImageList = () => {
  const images = useSelector((state) => state.product.product.images);
  return (
    <div>
      {images.length === 0 ? (
        <img
          height="200"
          alt="Product Image"
          loading="lazy"
          src={NoImageProduct}
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
