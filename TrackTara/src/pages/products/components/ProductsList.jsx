import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "../../../store/state/actions/productActions";
import { Link, useNavigate } from "react-router-dom";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [hoveredProductId, products]);

  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
      setShowModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  if (status === "loading") return <div className="table-empty-state">Завантаження...</div>;
  if (status === "failed") return <div className="table-empty-state text-danger">Помилка завантаження продуктів</div>;
  if (!Array.isArray(products) || products.length === 0) return <div className="table-empty-state">Продукти відсутні</div>;

  return (
    <div className="table-container">
      <div className="text-end mb-3">
        <Link to="/product/create" className="btn btn-primary" title="Додати продукт">
          <img src="/Icons for functions/free-icon-plus-3303893.png" alt="Create New" height="20" />
        </Link>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Зображення</th>
            <th>Назва</th>
            <th>Опис</th>
            <th>Тип</th>
            <th>Дата виробництва</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[currentImageIndex[product.id] || 0]?.filePath || "/images/noImageProduct.png"}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    <img
                      src="/images/noImageProduct.png"
                      alt="No image"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                </div>
              </td>
              <td className="text-start">{product.name}</td>
              <td className="text-start">{product.description}</td>
              <td className="text-start">{product.typeName}</td>
              <td className="text-start">{new Date(product.manufactureDate).toISOString().split("T")[0]}</td>
              <td className="text-center">
                <button
                  className="table-action-btn"
                  title="Редагувати продукт"
                  onClick={() => navigate(`/product/update/${product.id}`)}
                >
                  <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" />
                </button>
                <button
                  className="table-action-btn"
                  title="Видалити продукт"
                  onClick={() => handleDelete(product.id)}
                >
                  <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" />
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
                <h5 className="modal-title">Підтвердження видалення</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Ви дійсно хочете видалити цей продукт?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Скасувати
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Видалити
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
