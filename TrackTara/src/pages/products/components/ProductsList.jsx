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

  const confirmDelete = () => {
    dispatch(deleteProduct(productToDelete));
    setShowModal(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  if (status === "loading") return <div className="table-empty-state">Завантаження...</div>;
  if (status === "failed") return <div className="table-empty-state text-danger">Помилка завантаження продуктів</div>;
  if (!Array.isArray(products) || products.length === 0) return <div className="table-empty-state">Продукти відсутні</div>;

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th className="text-start">Назва</th>
            <th className="text-start">Опис</th>
            <th className="text-start">Дата виробництва</th>
            <th className="text-center" style={{ width: '120px' }}>Дії</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="text-start">
                <Link to={`/product/detail/${product.id}`} className="table-link">
                  {product.name}
                </Link>
              </td>
              <td className="text-start">{product.description}</td>
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
