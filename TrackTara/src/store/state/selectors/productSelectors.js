import { createSelector } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";
const selectProductList = (state) => state.product.productList;

export const selectMemoizedProductList = createSelector(
  [selectProductList],
  (productList) => {
    return productList;
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);