import React, { memo, useCallback } from "react";
import useActions from "../../../../../hooks/useActions";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteProductImage,
  fetchProductById,
} from "../../../../../store/state/actions/productActions";
import { useDispatch } from "react-redux";

const ImageItem = ({ image }) => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const handleRemove = useCallback(async () => {
    try {
      const result = await deleteProductImage({ productId, imageId: image.id });

      if (result.success) {
        toast.success("Image removed successfully!");
        dispatch(fetchProductById(productId));
      } else {
        toast.error(result.message || "Failed to remove image");
      }
    } catch (error) {
      toast.error("An error occurred while removing the image");
    }
  }, [productId]);

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
        src={image.filePath}
        className="border rounded"
      />
    </div>
  );
};

export default memo(ImageItem);
