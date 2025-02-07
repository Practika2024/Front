import NoImageProduct from "../assets/images/noImageProduct.png";

const productImage = (productImage) => {
  if (productImage !== undefined)
    return productImage === "N/A"
      ? NoImageProduct
      : `http://13.60.245.135:4312/Images/productImages/${productImage}`;
  else return NoImageProduct;
};

export default productImage;
