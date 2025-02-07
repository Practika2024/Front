import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
import useActions from "../../../../hooks/useActions";
import { useSelector } from "react-redux";

const EditManufacturerModal = ({ showModal, closeModal, manufacturer }) => {
  const { updateManufacturer } = useActions();
  const [name, setName] = useState(manufacturer.name);
  const [selectedCategories, setSelectedCategories] = useState(
    manufacturer.categories || []
  );

  const categoryList = useSelector((store) => store.category.categoryList);

  useEffect(() => {
    setName(manufacturer.name);
    setSelectedCategories(manufacturer.categories || []);
  }, [manufacturer]);

  const handleSave = useCallback(async () => {
    const updatedManufacturer = {
      ...manufacturer,
      name,
      categories: selectedCategories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    };

    const result = await updateManufacturer(updatedManufacturer);

    if (result.success) {
      toast.success("Manufacturer updated successfully!");
      closeModal();
    } else {
      toast.error(result.message || "Failed to update manufacturer.");
    }
  }, [name, selectedCategories, manufacturer, updateManufacturer, closeModal]);

  const handleCancel = () => {
    setName(manufacturer.name);
    setSelectedCategories(manufacturer.categories || []);
    closeModal();
  };

  return (
    <Modal open={showModal} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Edit Manufacturer
        </Typography>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Autocomplete
          multiple
          size="small"
          options={categoryList}
          value={selectedCategories}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => setSelectedCategories(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Categories" placeholder="Choose" />
          )}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="inherit" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditManufacturerModal;
