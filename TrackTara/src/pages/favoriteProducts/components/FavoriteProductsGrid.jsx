import React, { memo } from 'react'
import { Grid2, Typography } from '@mui/material'
import FavoriteProductCard from './FavoriteProductCard'

const FavoriteProductsGrid = memo(({ favoriteProducts }) => {
  return (
    <Grid2 container spacing={3}>
      {favoriteProducts.length > 0 ? (
        favoriteProducts.map((product) => (
          <Grid2
            key={product.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <FavoriteProductCard product={product} />
          </Grid2>
        ))
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ mt: 4, ml: 40 }}
        >
          No products found.
        </Typography>
      )}
    </Grid2>
  )
})

export default FavoriteProductsGrid