import React from "react";
import ProductsList from "./components/ProductsList.jsx";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  return (
    <div className="container my-3">
      <Link to={`/product/add`}>
        <button className="btn btn-primary float-end">
            <img
                src="public/Icons for functions/free-icon-plus-3303893.png"
                alt="Create New Container"
                height="20"
            />
        </button>
      </Link>
      <h1>Продукти</h1>
      <ProductsList />
    </div>
  );
};

export default ProductsPage;
