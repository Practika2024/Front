import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useActions from "../../../../../hooks/useActions";
import CategorySpecificForm from "./CategorySpecificForm";
import TextBox from "./TextBox";
import { categoryListSwitch } from "./categoryListSwitch";

const ProductForm = () => {
  const { getCategories, getManufacturers, createProduct } = useActions();
  const navigate = useNavigate();
  useEffect(() => {
    getCategories();
    getManufacturers();
  }, []);

  const categoryList = useSelector((state) => state.category.categoryList);
  const manufacturerList = useSelector(
    (state) => state.manufacturer.manufacturerList
  );

  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    stockQuantity: 0,
    manufacturerId: "",
    categoryId: "",
    componentCharacteristic: {},
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCategoryChange = useCallback(
    (e) => {
      const category = e.target.value;
      const selectedCategoryObj = categoryList.find((c) => c.name === category);
      setSelectedCategory(category);
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedCategoryObj ? selectedCategoryObj.id : "",
        componentCharacteristic: {},
      }));
    },
    [categoryList]
  );

  const handleCharacteristicChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const updatedCharacteristics = { ...prev.componentCharacteristic };
        updatedCharacteristics[categoryListSwitch(selectedCategory)] = {
          ...(updatedCharacteristics[categoryListSwitch(selectedCategory)] ||
            {}),
          [name]: value,
        };
        return { ...prev, componentCharacteristic: updatedCharacteristics };
      });
    },
    [selectedCategory]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await createProduct(formData);
      if (result.success) {
        toast.success(result.message);
        navigate("/products");
      } else {
        toast.error(result.message);
      }
    },
    [createProduct]
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 500 }}
    >
      <TextBox
        value={formData.name}
        onChange={handleInputChange}
        name={"name"}
        label={"Product Name"}
      />
      <TextField
        label="Price"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        multiline
        rows={4}
        fullWidth
      />
      <TextField
        label="Stock Quantity"
        type="number"
        name="stockQuantity"
        value={formData.stockQuantity}
        onChange={handleInputChange}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="manufacturer-label">Manufacturer</InputLabel>
        <Select
          labelId="manufacturer-label"
          label="Manufacturer"
          name="manufacturerId"
          value={formData.manufacturerId}
          onChange={handleInputChange}
        >
          {manufacturerList.map((manufacturer) => (
            <MenuItem key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          label="Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categoryList.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCategory && (
        <CategorySpecificForm
          category={selectedCategory}
          onChange={handleCharacteristicChange}
        />
      )}
      <Button variant="contained" type="submit">
        Create Product
      </Button>
    </Box>
  );
};

export default ProductForm;
