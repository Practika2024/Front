import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { useSelector } from "react-redux";
import useActions from "../../../../hooks/useActions";
import { useRenderCount } from "../../../../hooks/useRenderCount";

const ProductsList = React.memo(() => {
  const productList = useSelector((state) => state.product.productList);
  const { getProducts } = useActions();

  const renderCount = useRenderCount();

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="my-3">
      <div className="d-flex flex-row flex-wrap gap-3">
        {productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <h5>Render count: {renderCount}</h5>
    </div>
  );
});

export default ProductsList;
