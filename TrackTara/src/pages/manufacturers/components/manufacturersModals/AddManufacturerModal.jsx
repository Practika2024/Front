import React, { useState, useCallback } from 'react'
import { Modal, Box, Typography, TextField, Button } from '@mui/material'
import { toast } from 'react-toastify'
import useActions from '../../../../hooks/useActions'

const AddManufacturerModal = ({ showModal, closeModal }) => {
  const { createManufacturer } = useActions()
  const [manufacturerName, setManufacturerName] = useState('')

  const handleAddManufacturer = useCallback(async () => {
    const result = await createManufacturer(manufacturerName)
    if (result.success) {
      setManufacturerName('')
      closeModal()
    } else {
      toast.error(result.message)
    }
  }, [manufacturerName, createManufacturer, closeModal])

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
        }}
      >
        <Typography variant="h6" component="h2">
          Add New Manufacturer
        </Typography>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          value={manufacturerName}
          onChange={(e) => setManufacturerName(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="inherit" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleAddManufacturer}>
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddManufacturerModal
