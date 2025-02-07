import { createSelector } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";
const selectManufacturerList = (state) => state.manufacturer.manufacturerList;

export const selectMemoizedmanufacturerList = createSelector(
  [selectManufacturerList],
  (manufacturerList) => {
    return manufacturerList;
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);