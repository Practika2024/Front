import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../../../store/state/actions/productActions";
import ProductImages from "./components/ProductImages";

const ProductEdit = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch]);

  return (
    <div>
      {product && (
        <div className="container">
          <div className="d-flex flex-column align-items-center gap-3">
            <h1 className="m-0">Edit Product: {product.name}</h1>
            <ProductImages />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
