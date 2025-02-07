import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useActions from "../../../../hooks/useActions";
import UserMessage from "../../../../components/common/userMessage/UserMessage";
import productImage from "../../../../hooks/productImage";
import "bootstrap/dist/css/bootstrap.min.css";
import { categoryListSwitch } from "./categoryListSwitch";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { getProductById } = useActions();
  const products = useSelector((state) => state.product.productList);

  useEffect(() => {
    if (productId) {
      const fetchedProduct = products.find((p) => p.id === productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        getProductById(productId).then((data) => setProduct(data.payload));
      }
    }
  }, [productId, products]);

  if (!product) {
    return <UserMessage message="Loading product details..." />;
  }

  const renderCharacteristics = (characteristics) => {
    const categoryKey = categoryListSwitch(product.category.name);
    const categoryCharacteristics = characteristics[categoryKey];
    if (!categoryCharacteristics) return null;

    return (
      <table className="table table-striped">
        <tbody>
          {Object.entries(categoryCharacteristics).map(([key, value]) => (
            <tr key={key}>
              <td>
                <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>
              </td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Карусель ліворуч */}
        <div className="col-md-6">
          {product.images.length > 0 ? (
            <div
              id="productCarousel"
              className="carousel slide bg-black text-dark bg-opacity-25 rounded"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {product.images.map((image, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={index}
                  >
                    <img
                      src={productImage(image.filePath)}
                      className="d-block w-100 rounded"
                      alt={`Slide ${index}`}
                      style={{ height: "300px", objectFit: "contain" }}
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#productCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#productCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          ) : (
            <img
              src={productImage(undefined)}
              className="d-block w-100 rounded"
              style={{ height: "300px", objectFit: "contain" }}
            />
          )}
        </div>

        {/* Основна інформація праворуч */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <strong>Description</strong>
                </td>
                <td>{product.description}</td>
              </tr>
              <tr>
                <td>
                  <strong>Price</strong>
                </td>
                <td>${product.price}</td>
              </tr>
              <tr>
                <td>
                  <strong>Stock Quantity</strong>
                </td>
                <td>{product.stockQuantity}</td>
              </tr>
              <tr>
                <td>
                  <strong>Manufacturer</strong>
                </td>
                <td>{product.manufacturer.name}</td>
              </tr>
              <tr>
                <td>
                  <strong>Category</strong>
                </td>
                <td>{product.category.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Нижня частина: Таблиця характеристик */}
      <div className="row mt-4">
        <div className="col-12">
          <h4>Characteristics</h4>
          {renderCharacteristics(product.componentCharacteristic)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
