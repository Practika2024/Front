import {
    setCategoryId,
    setManufacturerIds,
    setName,
    setMinPrice,
    setMaxPrice,
    setMinStockQuantity,
    setMaxStockQuantity,
    resetFilters,
  } from "../reduserSlises/filtersSlice";
  
  export const updateCategoryId = (categoryId) => (dispatch) => {
    dispatch(setCategoryId(categoryId));
  };
  
  export const updateManufacturerIds = (manufacturerIds) => (dispatch) => {
    dispatch(setManufacturerIds(manufacturerIds));
  };
  
  export const updateName = (name) => (dispatch) => {
    dispatch(setName(name));
  };
  
  export const updateMinPrice = (minPrice) => (dispatch) => {
    dispatch(setMinPrice(minPrice));
  };
  
  export const updateMaxPrice = (maxPrice) => (dispatch) => {
    dispatch(setMaxPrice(maxPrice));
  };
  
  export const updateMinStockQuantity = (minStock) => (dispatch) => {
    dispatch(setMinStockQuantity(minStock));
  };
  
  export const updateMaxStockQuantity = (maxStock) => (dispatch) => {
    dispatch(setMaxStockQuantity(maxStock));
  };
  
  export const resetAllFilters = () => (dispatch) => {
    dispatch(resetFilters());
  };
  