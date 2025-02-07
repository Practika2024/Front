import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'

const CartItemModal = ({ open, onClose, onGoToCart }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="cart-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="cart-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          You have added this product to cart. In order to edit your cart -
          press go to cart button!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={onGoToCart}>
            Go to cart
          </Button>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default CartItemModal
