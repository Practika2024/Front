import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { selectMemoizedmanufacturerList } from "../../../../store/state/selectors/manufacturerSelectors";
import useActions from "../../../../hooks/useActions";
import useDebouncedEffect from "../../../../hooks/useDebouncedEffect";
import { FormControlLabel, Checkbox, Box, Typography, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const ManufacturerFilter = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const manufacturerList = useSelector(selectMemoizedmanufacturerList);
  const selectedManufacturerIds = useSelector(
    (state) => state.filters.manufacturerIds
  );
  const { updateManufacturerIds, filterProducts } = useActions();

  const handleCheckboxChange = (id) => {
    const updatedIds = selectedManufacturerIds.includes(id)
      ? selectedManufacturerIds.filter((manufacturerId) => manufacturerId !== id)
      : [...selectedManufacturerIds, id];
    updateManufacturerIds(updatedIds);
  };

  useDebouncedEffect(() => {
    filterProducts();
  }, 300, [selectedManufacturerIds]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="mb-3">
      <Typography variant="h6" gutterBottom>
        Manufacturers
        <IconButton onClick={toggleVisibility}>
          {isVisible ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Typography>
      {isVisible && (
        <Box display="flex" flexDirection="column">
          {manufacturerList.map((manufacturer) => (
            <FormControlLabel
              key={manufacturer.id}
              control={
                <Checkbox
                  checked={selectedManufacturerIds.includes(manufacturer.id)}
                  onChange={() => handleCheckboxChange(manufacturer.id)}
                  color="primary"
                />
              }
              label={manufacturer.name}
            />
          ))}
        </Box>
      )}
    </div>
  );
});

export default ManufacturerFilter;
