import React, { memo } from "react";
import ProductList from "../components/productList/ProductList";

const ProductListContainer = memo(() => {
    
  return (
    <>
      <ProductList />
    </>
  );
});

export default ProductListContainer;
