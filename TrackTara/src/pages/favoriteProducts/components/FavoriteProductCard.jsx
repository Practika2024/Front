import React, { memo } from 'react'
import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import { styled } from '@mui/system'
import FavoriteIcon from './FavoriteIcon'
import productImage from '../../../hooks/productImage'
import ProductToCartButton from '../../cartItems/components/ProductToCartButton'

const FavoriteProductCard = memo(({ product }) => {
  return (
    <CardWrapper>
      <FavoriteIconWrapper>
        <FavoriteIcon productId={product.id} />
      </FavoriteIconWrapper>

      <Media
        image={productImage(product?.images[0]?.filePath)}
        title={product.name}
      />

      <ContentWrapper>
        <TruncatedTypography variant="h6" component="h2">
          {product.name}
        </TruncatedTypography>
        <TruncatedTypography variant="body2" color="textSecondary">
          {product.description}
        </TruncatedTypography>
        <Typography variant="h6" color="primary">
          ${product.price}
        </Typography>
      </ContentWrapper>

      <ButtonWrapper>
        <ProductToCartButton productId={product.id} />
      </ButtonWrapper>
    </CardWrapper>
  )
})

export default FavoriteProductCard

const CardWrapper = styled(Card)(({ theme }) => ({
  width: '250px',
  height: '350px',
  margin: 'auto',
  marginTop: theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}))

const Media = styled(CardMedia)({
  height: 140,
})

const ContentWrapper = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

const TruncatedTypography = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

const FavoriteIconWrapper = styled('div')({
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 1,
})

export const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  padding: '8px 0',
})
