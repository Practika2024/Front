import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import FavoriteProductsGrid from "./FavoriteProductsGrid";
import SearchField from "./filter/SearchField";
import { Paper, Typography } from "@mui/material";
import useFilteredProducts from "../hooks/useFilteredProducts";
import FavoriteProductsMinMaxInput from "./filter/FavoriteProductsMinMaxInput";

const FavoriteProductsContainer = React.memo(() => {
  const { loadFavoriteProducts } = useActions();
  const userId = useSelector((state) => state.user.currentUser?.id);

  const {
    filteredProducts,
    searchTerm,
    maxPrice,
    setSearchTerm,
    setPriceRange,
    setQuantityRange,
  } = useFilteredProducts()

  const handleRangeChange = useCallback((key, value) => {
    switch (key) {
      case 'priceMin':
        setPriceRange((prev) => [value, prev[1]])
        break
      case 'priceMax':
        setPriceRange((prev) => [prev[0], value])
        break
      case 'quantityMin':
        setQuantityRange((prev) => [value, prev[1]])
        break
      case 'quantityMax':
        setQuantityRange((prev) => [prev[0], value])
        break
      default:
        break
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadFavoriteProducts(userId);
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>
            <SearchField
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <FavoriteProductsMinMaxInput
              label="Price UAH"
              minLimit={0}
              maxLimit={maxPrice}
              step={50}
              filterKeyMin="priceMin"
              filterKeyMax="priceMax"
              onFilterChange={handleRangeChange}
            />
            <FavoriteProductsMinMaxInput
              label="Quantity"
              minLimit={0}
              maxLimit={100}
              step={1}
              filterKeyMin="quantityMin"
              filterKeyMax="quantityMax"
              onFilterChange={handleRangeChange}
            />
          </Paper>
        </div>
        <div className="col-md-9">
          <FavoriteProductsGrid favoriteProducts={filteredProducts} />
        </div>
      </div>
    </div>
  );
});

export default FavoriteProductsContainer;
