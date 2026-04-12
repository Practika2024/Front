import React from "react";
import ProductsList from "./components/ProductsList.jsx";
import { Link } from "react-router-dom";
import useAppRoles from "../../hooks/useAppRoles";

const ProductsPage = () => {
  const roles = useAppRoles();
  const canEditCatalog =
    roles.includes("Operator") || roles.includes("Administrator");

  return (
    <div className="container my-3">
      {canEditCatalog && (
        <Link to={`/product/add`}>
          <button className="btn btn-primary float-end" type="button">
            <img
              src="public/Icons for functions/free-icon-plus-3303893.png"
              alt="Створити новий продукт"
              height="20"
            />
          </button>
        </Link>
      )}
      <h1>Продукти</h1>
      <ProductsList />
    </div>
  );
};

export default ProductsPage;
