import { createSelector } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";
const selectCategoryList = (state) => state.category.categoryList;

export const selectMemoizedcategoryList = createSelector(
  [selectCategoryList],
  (categoryList) => {
    return categoryList;
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);