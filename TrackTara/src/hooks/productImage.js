import NoImageProduct from "../assets/images/noImageProduct.png";
import { API_CONFIG } from "../utils/config/apiConfig";

const origin = () =>
  String(API_CONFIG.BASE_URLS.PRODUCT_IMAGES_ORIGIN || "").replace(/\/$/, "");

const productImage = (productImage) => {
  if (productImage !== undefined)
    return productImage === "N/A"
      ? NoImageProduct
      : `${origin()}/Images/productImages/${productImage}`;
  else return NoImageProduct;
};

export default productImage;
