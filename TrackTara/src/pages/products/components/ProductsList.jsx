import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "../../../store/state/actions/productActions";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const status = useSelector((state) => state.product.status);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let interval;
    if (hoveredProductId) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevState) => ({
          ...prevState,
          [hoveredProductId]: (prevState[hoveredProductId] + 1) % products.find((p) => p.id === hoveredProductId).images.length,
        }));
      }, 2000); // Change image every 2 seconds
    }
    return () => clearInterval(interval);
  }, [hoveredProductId, products]);

  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(productToDelete));
    setShowModal(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error loading products</div>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
          <tr>
            <th>Фото</th>
            <th>Назва</th>
            <th>Опис</th>
            <th>Дата виробництва</th>
            <th>Видалити</th>
          </tr>
          </thead>
          <tbody>
          {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.images && product.images.length > 0 && (
                      <div
                          onMouseEnter={() => {
                            setHoveredProductId(product.id);
                            setCurrentImageIndex((prevState) => ({
                              ...prevState,
                              [product.id]: 0,
                            }));
                          }}
                          onMouseLeave={() => setHoveredProductId(null)}
                      >
                        <img
                            src={product.images[currentImageIndex[product.id] || 0].filePath}
                            alt={product.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              transition: "opacity 0.5s ease-in-out",
                            }}
                        />
                      </div>
                  )}
                </td>
                <td>
                  <Link
                      title={`Деталі продукту`}
                      to={`/product/detail/${product.id}`}
                  >
                    {product.name}
                  </Link>
                </td>
                <td>{product.description}</td>
                <td>
                  {new Date(product.manufactureDate).toISOString().split("T")[0]}
                </td>
                <td>
                  <button
                      title={`Видалити продукт`}
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(product.id)}
                  >
                    <img
                        src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                        alt="Delete"
                        height="20"
                    />
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {showModal && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Deletion</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={cancelDelete}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to delete this product?</p>
                  </div>
                  <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelDelete}
                    >
                      No
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={confirmDelete}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductsList;