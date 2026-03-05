import React, { memo, useCallback } from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'
import { toast } from 'react-toastify'
import useActions from '../../../../hooks/useActions'

const DeleteProductModal = ({ showModal, closeModal, productId }) => {
  const { deleteProduct } = useActions()

  const handleDeleteProduct = useCallback(async () => {
    const result = await deleteProduct(productId)
    if (result.success) {
      closeModal()
      toast.success("Продукт успішно видалено")
    } else {
      toast.error(result.message)
    }
  }, [deleteProduct, productId, closeModal])

  return (
    <Modal open={showModal} onClose={closeModal}>
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
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" component="h2">
          Підтвердження видалення
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Ви впевнені, що хочете видалити цей продукт?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
          <Button variant="contained" color="inherit" onClick={closeModal}>
            Скасувати
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteProduct}>
            Видалити
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default memo(DeleteProductModal)
