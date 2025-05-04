import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  Card,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import Select from "react-select";
import Loader from "../../../../components/common/loader/Loader.jsx";
import {
  getContainerById,
  deleteContainer,
  setProductToContainer,
  clearProductFromTare,
} from "../../../../utils/services/ContainerService.js";
import { getAllContainerTypes } from "../../../../utils/services/ContainerTypesService.js";
import { fetchProducts } from "../../../../store/state/actions/productActions.js";
import { fetchAllContainerHistories } from "../../../../store/state/actions/containerHistoryActions.js";

const ContainerDetailPage = () => {
  const { containerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [containerTypes, setContainerTypes] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showRemoveProductModal, setShowRemoveProductModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const products = useSelector((state) => state.product?.products || []);
  const containerHistory = useSelector((state) => state.containerHistory?.histories || []);

  useEffect(() => {
    if (!containerId) return;

    const fetchData = async () => {
      try {
        const [tare, types] = await Promise.all([
          getContainerById(containerId),
          getAllContainerTypes(),
        ]);

        console.log("📦 Повний об'єкт контейнера:", tare);
        console.log("📦 Отримані типи контейнерів:", types);

        setContainer(tare.payload);
        setContainerTypes(types);
        dispatch(fetchProducts());
        dispatch(fetchAllContainerHistories(containerId));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [containerId, dispatch]);

  const refreshContainerData = async () => {
    try {
      const updatedContainer = await getContainerById(containerId);
      setContainer(updatedContainer);
      dispatch(fetchAllContainerHistories(containerId));
    } catch (error) {
      console.error("Error refreshing container:", error);
    }
  };

  const getTypeName = (typeIdRaw) => {
    const typeId = String(typeIdRaw ?? "").trim();
    console.log("↪️ Отриманий typeId:", `"${typeId}"`);
    console.log("📦 containerTypes:", containerTypes.map((t) => `"${t.id}"`));

    if (!typeId || !Array.isArray(containerTypes)) return "Unknown Type";

    const match = containerTypes.find((type) => String(type.id).trim() === typeId);
    if (!match) {
      console.warn("⚠️ Не знайдено відповідного типу для typeId:", `"${typeId}"`);
    }

    return match ? match.name : "Unknown Type";
  };

  const getProductName = (productId) =>
      products.find((product) => product.id === productId)?.name || "Unknown";

  const handleUpdate = () => navigate(`/tare/update/${containerId}`);

  const handleDelete = () => {
    if (!container.isEmpty) {
      alert("Не можна видалити контейнер із продуктом.");
      return;
    }
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteContainer(containerId);
      navigate("/tare");
    } catch (error) {
      console.error("Error deleting container:", error);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId) return;
    try {
      await setProductToContainer(containerId, selectedProductId);
      setShowAddProductModal(false);
      refreshContainerData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleClearProduct = async () => {
    try {
      await clearProductFromTare(containerId);
      setShowRemoveProductModal(false);
      refreshContainerData();
    } catch (error) {
      console.error("Error clearing product:", error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">Помилка завантаження даних</div>;
  if (!container) return <div className="alert alert-warning">Контейнер не знайдено</div>;

  return (
      <Container className="mt-5">
        <div className="d-flex justify-content-start mb-4">
          <Button variant="secondary" onClick={() => navigate("/tare")}>← Назад</Button>
        </div>

        <h2 className="text-center mb-4">Деталі контейнера</h2>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>{container.name}</Card.Title>
                <Card.Text>
                  <strong>Тип:</strong> {getTypeName(container.typeId || container.type?.id)}<br />
                  <strong>Об'єм (л):</strong> {container.volume}<br />
                  <strong>Вміст:</strong>{" "}
                  {container.isEmpty
                      ? "Порожній"
                      : getProductName(container.productId)}<br />
                  <strong>Нотатки:</strong> {container.notes || "Немає"}
                </Card.Text>
                <Button title="Редагувати контейнер" variant="outline-secondary" onClick={handleUpdate} className="p-1 border-0">
                  <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" height="20" />
                </Button>
                <Button title="Видалити контейнер" variant="outline-secondary" onClick={handleDelete} className="p-1 border-0">
                  <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" height="20" />
                </Button>
                {container.isEmpty ? (
                    <Button title="Додати продукт" variant="outline-secondary" onClick={() => setShowAddProductModal(true)} className="p-1 border-0">
                      <img src="/Icons for functions/free-icon-import-7234396.png" alt="Add Product" height="20" />
                    </Button>
                ) : (
                    <Button title="Очистити контейнер" variant="outline-secondary" onClick={() => setShowRemoveProductModal(true)} className="p-1 border-0">
                      <img src="/Icons for functions/free-icon-package-1666995.png" alt="Clear Product" height="20" />
                    </Button>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Історія контейнера</Card.Title>
                {containerHistory.length > 0 ? (
                    <Table striped bordered hover>
                      <thead>
                      <tr>
                        <th>#</th>
                        <th>Продукт</th>
                        <th>Дата заповнення</th>
                        <th>Дата очищення</th>
                      </tr>
                      </thead>
                      <tbody>
                      {containerHistory.map((history, index) => (
                          <tr key={history.id}>
                            <td>{index + 1}</td>
                            <td>{getProductName(history.productId)}</td>
                            <td>{new Date(history.startDate).toLocaleString()}</td>
                            <td>{history.endDate ? new Date(history.endDate).toLocaleString() : ""}</td>
                          </tr>
                      ))}
                      </tbody>
                    </Table>
                ) : (
                    <p>Історія відсутня</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Модалки */}
        <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Виберіть продукт</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Select
                options={products.map((product) => ({ value: product.id, label: product.name }))}
                onChange={(option) => setSelectedProductId(option?.value || "")}
                placeholder="Пошук за назвою продукту"
                isClearable
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>Скасувати</Button>
            <Button variant="primary" onClick={handleAddProduct} disabled={!selectedProductId}>Додати продукт</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showRemoveProductModal} onHide={() => setShowRemoveProductModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Видалення продукту</Modal.Title>
          </Modal.Header>
          <Modal.Body>Ви впевнені, що хочете видалити продукт із контейнера?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRemoveProductModal(false)}>Скасувати</Button>
            <Button variant="primary" onClick={handleClearProduct}>Видалити продукт</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Підтвердження видалення</Modal.Title>
          </Modal.Header>
          <Modal.Body>Ви впевнені, що хочете видалити цей контейнер?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Скасувати</Button>
            <Button variant="danger" onClick={confirmDelete}>Видалити</Button>
          </Modal.Footer>
        </Modal>
      </Container>
  );
};

export default ContainerDetailPage;
