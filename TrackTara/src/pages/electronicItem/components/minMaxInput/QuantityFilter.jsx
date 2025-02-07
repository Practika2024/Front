import React, { memo } from "react";
import { useSelector } from "react-redux";
import useActions from "../../../../hooks/useActions";
import MinMaxInput from "../minMaxInput/MinMaxInput";
import useDebouncedEffect from "../../../../hooks/useDebouncedEffect";

const QuantityFilter = memo(() => {
  const minStockQuantity = useSelector((state) => state.filters.minStockQuantity);
  const maxStockQuantity = useSelector((state) => state.filters.maxStockQuantity);
  const { updateMinStockQuantity, updateMaxStockQuantity, filterProducts } = useActions();

  const handleMinQuantityChange = (value) => {
    updateMinStockQuantity(value);
  };


  const handleMaxQuantityChange = (value) => {
    updateMaxStockQuantity(value);
  };

  useDebouncedEffect(() => {
    filterProducts();
  }, 500, [minStockQuantity, maxStockQuantity]);

  return (
    <MinMaxInput
      label="Кількість"
      minLimit={0}
      maxLimit={100}
      step={1}
      valueMin={minStockQuantity}
      valueMax={maxStockQuantity}
      onMinChange={handleMinQuantityChange}
      onMaxChange={handleMaxQuantityChange}
    />
  );
});

export default QuantityFilter;
