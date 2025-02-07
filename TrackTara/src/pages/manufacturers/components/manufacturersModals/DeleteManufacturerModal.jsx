import React, { useCallback } from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'
import { toast } from 'react-toastify'
import useActions from '../../../../hooks/useActions'

const DeleteManufacturerModal = ({ showModal, closeModal, manufacturerId }) => {
  const { deleteManufacturer } = useActions()

  const handleDeleteManufacturer = useCallback(async () => {
    const result = await deleteManufacturer(manufacturerId)
    if (result.success) {
      closeModal()
    } else {
      toast.error(result.message)
    }
  }, [deleteManufacturer, manufacturerId, closeModal])

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
          Confirm Deletion
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Are you sure you want to delete this manufacturer?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
          <Button variant="contained" color="inherit" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteManufacturer}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteManufacturerModal
