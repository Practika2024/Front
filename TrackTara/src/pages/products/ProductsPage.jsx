import React from "react";
import ProductsList from "./components/productCards/ProductsList";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  return (
    <div className="container my-3">
      <Link to={`create`}>
        <button className="btn btn-primary float-end">Add product</button>
      </Link>
      <h1>Products</h1>
      <ProductsList />
    </div>
  );
};

export default ProductsPage;
