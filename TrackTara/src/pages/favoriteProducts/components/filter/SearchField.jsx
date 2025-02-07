import React, { memo } from 'react';
import { TextField } from '@mui/material';

const SearchField = memo(({ searchTerm, onSearchChange }) => {
  return (
    <TextField
      label="Search products..."
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      sx={{ mb: 2, p: 1 }}
    />
  );
});

export default SearchField;