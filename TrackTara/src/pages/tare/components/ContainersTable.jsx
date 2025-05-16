import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Offcanvas, Pagination, Row, Col } from "react-bootstrap";

import { getAllContainerTypes } from "../../../utils/services/ContainerTypesService";
import { fetchContainers, addProductToContainer, removeProductFromContainer } from "../../../store/state/actions/containerActions";
import { fetchContainerTypes } from "../../../store/state/actions/containerTypeActions";
import { fetchProducts } from "../../../store/state/actions/productActions";
import { addReminder } from "../../../store/state/actions/reminderActions";
import ContainerFilterForm from "./ContainerFilterForm.jsx";
import { deleteContainer } from "../../../utils/services/ContainerService.js";
import ConfirmDeleteModal from "./tareModals/ConfirmDeleteModal";
import ConfirmClearProductModal from "./tareModals/ConfirmClearModal";
import ProductSelectModal from "./tareModals/ProductSelectModal";
import ReminderModal from "./tareModals/ContainerReminderModal.jsx";

const ContainersTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containers = useSelector((state) => state.containers?.containers || []);
  const products = useSelector((state) => state.product?.products || []);

  const [filteredContainers, setFilteredContainers] = useState([]);
  const [typeNames, setTypeNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });

  const [showProductModal, setShowProductModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);
  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const [selectedContainerId, setSelectedContainerId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reminderForm, setReminderForm] = useState({ title: "", dueDate: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [containerTypes, setContainerTypes] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchContainers());
    dispatch(fetchContainerTypes()).then((res) => {
      if (res?.payload) {
        const mapping = res.payload.reduce((acc, type) => {
          acc[type.id] = type.name;
          return acc;
        }, {});
        setTypeNames(mapping);
      }
    });
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    getAllContainerTypes().then(setContainerTypes).catch(console.error);
  }, []);

  useEffect(() => {
    setFilteredContainers(containers);
  }, [containers]);

  const refreshData = () => dispatch(fetchContainers());
  const getTypeNameById = (typeId) => containerTypes.find((t) => t.id === typeId)?.name || "Unknown Type";

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const handleDelete = (id) => {
    const container = containers.find((c) => c.id === id);
    if (container && !container.isEmpty) return alert("Спочатку потрібно очистити контейнер");
    setSelectedContainerId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteContainer(selectedContainerId);
      setFilteredContainers((prev) => prev.filter((c) => c.id !== selectedContainerId));
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Error deleting container:", err);
    }
  };

  const handleSetProduct = (id) => {
    setSelectedContainerId(id);
    setShowProductModal(true);
  };

  const confirmSetProduct = () => {
    if (selectedProductId) {
      dispatch(addProductToContainer(selectedContainerId, selectedProductId)).then(() => {
        refreshData();
        setShowProductModal(false);
        setSelectedProductId(null);
      });
    }
  };

  const handleClearProduct = (id) => {
    setSelectedContainerId(id);
    setShowConfirmClearModal(true);
  };

  const confirmClearProduct = () => {
    dispatch(removeProductFromContainer(selectedContainerId)).then(() => {
      refreshData();
      setShowConfirmClearModal(false);
    });
  };

  const handleOpenReminderModal = (containerId) => {
    setSelectedContainerId(containerId);
    setReminderForm({ title: "", dueDate: "", type: "" });
    setShowReminderModal(true);
  };

  const handleCreateReminder = async () => {
    try {
      const payload = {
        title: reminderForm.title,
        dueDate: new Date(reminderForm.dueDate).toISOString(),
        type: parseInt(reminderForm.type),
      };
      await dispatch(addReminder(selectedContainerId, payload));
      setShowReminderModal(false);
      refreshData();
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  const handleFilter = (filters) => {
    const { uniqueCode, name, minVolume, maxVolume, type, isEmpty } = filters;
    setFilteredContainers(
        containers.filter((container) =>
            (!uniqueCode || container.uniqueCode.includes(uniqueCode)) &&
            (!name || container.name.includes(name)) &&
            container.volume >= minVolume &&
            container.volume <= maxVolume &&
            (type.length === 0 || type.includes(String(container.typeId))) &&
            (isEmpty === null || container.isEmpty === isEmpty)
        )
    );
  };

  const sortedContainers = [...filteredContainers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedContainers.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  return (
      <div className="container mt-5">
        <h2 className="mb-4">Список контейнерів</h2>
        <div className="text-end mb-3">
          <Link to="/tare/create" className="btn btn-primary" title="Додати контейнер">
            <img src="/Icons for functions/free-icon-plus-3303893.png" alt="Create New" height="20" />
          </Link>
        </div>

        <Row>
          <Col lg={3} className="d-none d-lg-block">
            <ContainerFilterForm onFilter={handleFilter} />
          </Col>

          <Col lg={9}>
            <Button className="d-lg-none mb-3" onClick={() => setShowFilterOffcanvas(true)}>
              Фільтрувати
            </Button>

            {filteredContainers.length === 0 ? (
                <div className="table-empty-state">Контейнери відсутні</div>
            ) : (
                <table className="custom-table">
                  <thead>
                  <tr>
                    <th onClick={() => handleSort("uniqueCode")}>Код</th>
                    <th onClick={() => handleSort("name")}>Ім'я</th>
                    <th onClick={() => handleSort("typeId")}>Тип</th>
                    <th onClick={() => handleSort("volume")}>Об'єм (л)</th>
                    <th>Вміст</th>
                    <th>Зображення</th>
                    <th>Дії</th>
                  </tr>
                  </thead>
                  <tbody>
                  {currentItems.map((container) => (
                      <tr key={container.id}>
                        <td><Link to={`/tare/detail/${container.id}`}>{container.uniqueCode}</Link></td>
                        <td>{container.name}</td>
                        <td>{getTypeNameById(container.typeId)}</td>
                        <td>{container.volume}</td>
                        <td>
                          {container.isEmpty
                              ? "Порожній"
                              : products.find((p) => p.id === container.productId)?.name || "Невідомий продукт"}
                        </td>
                        <td>
                          {container.filePath ? (
                              <img
                                  src={container.filePath}
                                  alt={container.name}
                                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                              />
                          ) : (
                              "Немає фото"
                          )}
                        </td>

                        <td>
                          <button
                              className="table-action-btn"
                              title="Редагувати"
                              onClick={() => navigate(`/tare/update/${container.id}`)}
                          >
                            <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" />
                          </button>
                          {container.isEmpty ? (
                              <button
                                  className="table-action-btn"
                                  title="Встановити продукт"
                                  onClick={() => handleSetProduct(container.id)}
                              >
                                <img src="/Icons for functions/free-icon-import-7234396.png" alt="Set Product" />
                              </button>
                          ) : (
                              <button
                                  className="table-action-btn"
                                  title="Очистити продукт"
                                  onClick={() => handleClearProduct(container.id)}
                              >
                                <img src="/Icons for functions/free-icon-package-1666995.png" alt="Clear Product" />
                              </button>
                          )}
                          <button
                              className="table-action-btn"
                              title="Видалити"
                              onClick={() => handleDelete(container.id)}
                          >
                            <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" />
                          </button>
                          <button
                              className="table-action-btn"
                              title="Нагадування"
                              onClick={() => handleOpenReminderModal(container.id)}
                          >
                            <img src="/Icons for functions/free-icon-remainder-3156999.png" alt="Reminder" />
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}

            <div className="custom-pagination">
              {Array.from({ length: Math.ceil(filteredContainers.length / itemsPerPage) }, (_, index) => (
                  <div
                      key={index + 1}
                      className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                  >
                    <span className="page-link">{index + 1}</span>
                  </div>
              ))}
            </div>
          </Col>
        </Row>

        <ProductSelectModal
            show={showProductModal}
            onClose={() => setShowProductModal(false)}
            onConfirm={confirmSetProduct}
            products={products}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />

        <ConfirmDeleteModal
            show={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={confirmDelete}
        />

        <ConfirmClearProductModal
            show={showConfirmClearModal}
            onClose={() => setShowConfirmClearModal(false)}
            onConfirm={confirmClearProduct}
        />

        <ReminderModal
            show={showReminderModal}
            onHide={() => setShowReminderModal(false)}
            form={reminderForm}
            setForm={setReminderForm}
            onSubmit={handleCreateReminder}
        />

        <Offcanvas show={showFilterOffcanvas} onHide={() => setShowFilterOffcanvas(false)} placement="start">
          <Offcanvas.Header>
            <Button variant="secondary" onClick={() => setShowFilterOffcanvas(false)}>Назад</Button>
            <Offcanvas.Title className="ms-3">Фільтри</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ContainerFilterForm onFilter={handleFilter} />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
  );
};

export default ContainersTable;
