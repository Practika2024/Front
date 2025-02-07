import React from 'react'
import FavoriteIcon from '../../../favoriteProducts/components/FavoriteIcon'
import defaultImage from '../../../../assets/images/noImageProduct.png'
import productImage from '../../../../hooks/productImage'
import ProductToCartButton from '../../../cartItems/components/ProductToCartButton'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const imageUrl =
    product.images && product.images.length > 0
      ? productImage(product.images[0].filePath)
      : defaultImage

  return (
    <CardWrapper className="card mb-3" style={{ maxWidth: '18rem' }}>
      <div className="card-body text-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="card-img-top"
          style={{ width: '100%', height: 'auto' }}
        />
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-truncate">{product.description}</p>
        <p className="card-text">Price: ${product.price}</p>

        <FavoriteIconWrapper>
          <FavoriteIcon productId={product.id} />
        </FavoriteIconWrapper>

        <ButtonsContainer>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/electronicItem/product/${product.id}`)}
          >
            View Details
          </button>

          <ProductButtonWrapper>
            <ProductToCartButton productId={product.id} />
          </ProductButtonWrapper>

        </ButtonsContainer>
      </div>
    </CardWrapper>
  )
}

export default ProductCard

const CardWrapper = styled('div')({
  position: 'relative',
  maxWidth: '18rem',
  marginBottom: '1rem',
})

const FavoriteIconWrapper = styled('div')({
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 1,
})

const ButtonsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '1rem',
})

const ProductButtonWrapper = styled('div')({
  marginLeft: '20px',
})
