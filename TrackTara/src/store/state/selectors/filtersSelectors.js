export const selectFilters = (state) => state.filters;

export const selectManufacturerIds = (state) => state.filters.manufacturerIds;

export const selectManufacturerList = (state) => state.manufacturers.list; // Adjust based on manufacturer slice structure
