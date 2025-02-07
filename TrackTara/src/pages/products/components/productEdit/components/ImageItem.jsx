import React, { memo, useCallback } from "react";
import productImage from "../../../../../hooks/productImage";
import useActions from "../../../../../hooks/useActions";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ImageItem = ({ image }) => {
  const { deleteProductImageById } = useActions();
  const { productId } = useParams();

  const handleRemove = useCallback(async () => {
    try {
      const result = await deleteProductImageById(productId, image.id);
      if (result.success) {
        toast.success("Image removed successfully!");
      } else {
        toast.error(result.message || "Failed to remove image");
      }
    } catch (error) {
      toast.error("An error occurred while removing the image");
    }
  }, [productId, deleteProductImageById]);

  return (
    <div className="position-relative">
      <button
        type="button"
        className="btn-close position-absolute top-0 end-0 bg-danger p-2"
        aria-label="Close"
        onClick={handleRemove}
      />
      <img
        height="200"
        width="200"
        alt="Product"
        loading="lazy"
        src={productImage(image.filePath)}
        className="border rounded"
      />
    </div>
  );
};

export default memo(ImageItem);
