import React, { memo } from "react";
import ProductCard from "../productCard/ProductCard";
import UserMessage from "../../../../components/common/userMessage/UserMessage";
import { useSelector } from "react-redux";
import { selectMemoizedProductList } from "../../../../store/state/selectors/productSelectors";

const ProductList = memo(() => {
  const products = useSelector(selectMemoizedProductList);
  return (
    <div>
      <p>Electronic Item Page</p>
      {products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <UserMessage message="No products available" />
      )}
    </div>
  );
});

export default ProductList;
