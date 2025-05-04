import React from "react";
import { useSelector } from "react-redux";
import ImageItem from "./ImageItem";

const ImageList = ({ onRemove, imagesToDelete }) => {

  const images = useSelector((state) => state.product.product.images);

  const visibleImages = images.filter((image) => !imagesToDelete.includes(image.id));

  return (
    <div>
      {visibleImages.length === 0 ? (
        <img height="200" alt="Product Image" src="/images/noImageProduct.png" />
      ) : (
        <div className="d-flex gap-3 flex-wrap">
          {visibleImages.map((image) => (
            <ImageItem key={image.id} image={image} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageList;
