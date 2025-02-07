import React, { memo, useState, useEffect } from 'react'
import { TextField, Typography, Box, Slider } from '@mui/material'

const FavoriteProductsMinMaxInput = memo(
  ({
    label,
    minLimit,
    maxLimit,
    step,
    onFilterChange,
    filterKeyMin,
    filterKeyMax,
    initialMin = minLimit,
    initialMax = maxLimit,
  }) => {
    const [range, setRange] = useState([initialMin, initialMax])

    useEffect(() => {
      setRange([minLimit, maxLimit])
    }, [minLimit, maxLimit])

    const handleRangeChange = (newRange) => {
      setRange(newRange)
      onFilterChange(filterKeyMin, newRange[0])
      onFilterChange(filterKeyMax, newRange[1])
    }

    const handleInputChange = (event) => {
      const { name, value } = event.target
      const parsedValue = value ? parseInt(value, 10) : 0
      const newRange = [...range]

      if (name === 'min') {
        newRange[0] = parsedValue
      } else if (name === 'max') {
        newRange[1] = parsedValue
      }

      setRange(newRange)
      onFilterChange(name === 'min' ? filterKeyMin : filterKeyMax, parsedValue)
    }

    return (
      <Box mb={3}>
        <Typography variant="subtitle1">{label}</Typography>
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <TextField
            label="Min"
            name="min"
            variant="outlined"
            size="small"
            value={range[0]}
            onChange={handleInputChange}
            type="number"
          />
          <Typography>-</Typography>
          <TextField
            label="Max"
            name="max"
            variant="outlined"
            size="small"
            value={range[1]}
            onChange={handleInputChange}
            type="number"
          />
        </Box>
        <Slider
          value={range}
          onChange={(_, newValue) => handleRangeChange(newValue)}
          valueLabelDisplay="auto"
          disableSwap
          min={minLimit}
          max={maxLimit}
          step={step}
          sx={{ mt: 2 }}
        />
      </Box>
    )
  }
)

export default FavoriteProductsMinMaxInput