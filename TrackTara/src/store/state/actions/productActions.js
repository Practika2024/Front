import { ProductsService } from "../../../utils/services/ProductService";
import {
  getAll,
  getFilterProducts,
  deleteProductReduser,
  addProduct,
  updateProductReducer,
  getProductsByCategory,
  getProduct,
  getProductForEdit,
  updateImageForProduct,
} from "../reduserSlises/productSlice";

export const getProducts = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    await ProductsService.setAuthorizationToken(token);

    const res = await ProductsService.getProducts();

    dispatch(getAll(res));
  } catch (error) {
    console.error("get Products failed", error);
  }
};

export const createProduct = (product) => async (dispatch) => {
  try {

    const res = await ProductsService.createProduct(product);

    dispatch(addProduct(res));
    return { success: true, message: "Product created successfully." };
  } catch (error) {
    let errorMessage = "An error occurred during product creation.";

    if (error.response) {
      if (error.response.data?.title) {
        errorMessage = error.response.data.title;
      } else if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      }
    }

    console.error("Error creating product:", errorMessage);
    return { success: false, message: errorMessage };
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    const response = await ProductsService.deleteProduct(id);

    dispatch(deleteProductReduser(response));

    return { success: true, message: response };
  } catch (error) {
    return { success: false, message: error.response.data };
  }
};

export const updateProduct = (productId, model) => async (dispatch) => {
  try {
    const response = await ProductsService.updateProduct(productId, model);

    dispatch(updateProductReducer(response));

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    let errorMessage = "An error occurred during product creation.";

    if (error.response) {
      if (error.response.data?.title) {
        errorMessage = error.response.data.title;
      } else if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      }
    }

    console.error("Error creating product:", errorMessage);
    return { success: false, message: errorMessage };
  }
};

export const getProductById =
  (productId, forEdit = false) =>
  async (dispatch) => {
    try {
      const response = await ProductsService.getProductById(productId);

      if (forEdit) {
        dispatch(getProductForEdit(response));
      } else {
        dispatch(getProduct(response));
      }

      return { success: true, payload: response };
    } catch (error) {
      const errorMessage = error.response;
      return { success: false, message: errorMessage };
    }
  };

export const getProductsByCategoryId = (categoryId) => async (dispatch) => {
  try {
    const response = await ProductsService.getProductsByCategoryId(categoryId);

    dispatch(getProductsByCategory(response));

    return { success: true, payload: response };
  } catch (error) {
    const errorMessage = error.response;
    return { success: false, message: errorMessage };
  }
};

export const deleteProductImageById =
  (productId, productImageId) => async (dispatch) => {
    try {
      const response = await ProductsService.deleteProductImageById(
        productId,
        productImageId
      );

      dispatch(updateImageForProduct(response.images));

      return { success: true, payload: response };
    } catch (error) {
      const errorMessage = error.response;
      return { success: false, message: errorMessage };
    }
  };

export const addProductImages =
  (productId, imagesFiles) => async (dispatch) => {
    try {
      const response = await ProductsService.uploadProductImages(
        productId,
        imagesFiles
      );

      dispatch(updateImageForProduct(response.images));

      return { success: true, payload: response };
    } catch (error) {
      const errorMessage = error.response;
      return { success: false, message: errorMessage };
    }
  };

// export const filterProducts = (filters) => async (dispatch) => {
//   try {
//     const response = await ProductsService.getFilteredProducts(filters);

//     dispatch(getFilterProducts(response));

//     return { success: true, payload: response };
//   } catch (error) {
//     const errorMessage = error.response;
//     return { success: false, message: errorMessage };
//   }
// };

export const filterProducts = () => async (dispatch, getState) => {
  try {
    const filters = getState().filters;
    const response = await ProductsService.getFilteredProducts(filters);

    dispatch(getFilterProducts(response));

    return { success: true, payload: response };
  } catch (error) {
    const errorMessage = error.response;
    return { success: false, message: errorMessage };
  }
};