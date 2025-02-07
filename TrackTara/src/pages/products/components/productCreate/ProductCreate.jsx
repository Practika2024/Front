import React from "react";
import ProductForm from "./components/ProductForm";

const ProductCreate = () => {
  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Create Products</h1>
      <ProductForm />
    </div>
  );
};

export default ProductCreate;
