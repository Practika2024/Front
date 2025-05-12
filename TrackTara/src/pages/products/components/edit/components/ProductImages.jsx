import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchProductById,
  updateProductImages,
} from "../../../../../store/state/actions/productActions";
import ImageList from "./ImageList";

const ProductImages = ({ shouldNavigate = false }) => {
  const product = useSelector((state) => state.product.product);
  const dispatch = useDispatch();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const handleFileChange = useCallback((e) => {
    setSelectedFiles(Array.from(e.target.files));
  }, []);

  const markImageForDeletion = useCallback((imageId) => {
    setImagesToDelete((prev) => [...prev, imageId]);
  }, []);

  const handleUpdateImages = useCallback(async () => {
    if (!product?.id) {
      toast.error("Product ID is missing.");
      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("newImages", file);
    });

    imagesToDelete.forEach((id) => {
      formData.append("imagesToDelete", id);
    });

    try {
      const result = await updateProductImages(product.id, formData);

      if (result.success) {
        toast.success("Images updated successfully!");
        dispatch(fetchProductById(product.id));
        setImagesToDelete([]);
        setSelectedFiles([]);
      } else {
        toast.error(result.message || "Error updating images.");
      }
    } catch (err) {
      toast.error("Server error during image update.");
    }
  }, [product.id, selectedFiles, imagesToDelete, dispatch]);

  return (
      <div className="d-flex flex-column align-items-center gap-3">
        <div className="d-flex gap-3 align-items-center m-3">
          <input
              multiple
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              className="form-control"
              onChange={handleFileChange}
          />
        </div>
        <ImageList
            onRemove={markImageForDeletion}
            imagesToDelete={imagesToDelete}
        />
        <button className="btn btn-success mt-2" onClick={handleUpdateImages}>
          Update Images
        </button>
      </div>
  );
};

export default ProductImages;
