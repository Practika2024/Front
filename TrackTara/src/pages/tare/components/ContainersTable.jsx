import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { Table, Button, Modal, Row, Col, Offcanvas, Pagination } from "react-bootstrap";
import { getAllContainerTypes } from "../../../utils/services/ContainerTypesService";
import { fetchContainers, addProductToContainer, removeProductFromContainer } from "../../../store/state/actions/containerActions";
import { fetchContainerTypes } from "../../../store/state/actions/containerTypeActions";
import { fetchProducts } from "../../../store/state/actions/productActions";
import { addReminder } from "../../../store/state/actions/reminderActions";
import { Form } from "react-bootstrap";
import ContainerFilterForm from "./ContainerFilterForm.jsx";
import { deleteContainer } from "../../../utils/services/ContainerService.js";

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

  const [selectedContainerId, setSelectedContainerId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [containerTypes, setContainerTypes] = useState([]);

  const itemsPerPage = 10;

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderForm, setReminderForm] = useState({ title: "", dueDate: "", type: "" });
  // Завантаження даних при монтуванні
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
    const fetchContainerTypes = async () => {
      try {
        const types = await getAllContainerTypes();
        setContainerTypes(types);
      } catch (error) {
        console.error("Error fetching container types:", error);
      }
    };

    fetchContainerTypes();
  }, []);
  useEffect(() => {
    setFilteredContainers(containers);
  }, [containers]);

  // Хелпери
  const refreshData = () => dispatch(fetchContainers());
  const getTypeNameById = (typeId) => {
    const type = containerTypes.find((t) => t.id === typeId);
    return type ? type.name : "Unknown Type";
  };
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
        dueDate: new Date(reminderForm.dueDate).toISOString(), // ISO формат
        type: parseInt(reminderForm.type) // число
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

  // Пагінація та сортування
  const sortedContainers = [...filteredContainers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedContainers.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Рендер
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
                <div className="alert alert-warning">Контейнери відсутні</div>
            ) : (
                <Table striped bordered hover responsive>
                  <thead>
                  <tr>
                    <th onClick={() => handleSort("uniqueCode")}>Код</th>
                    <th onClick={() => handleSort("name")}>Ім'я</th>
                    <th onClick={() => handleSort("typeId")}>Тип</th>
                    <th onClick={() => handleSort("volume")}>Об'єм (л)</th>
                    <th>Вміст</th>
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
                          {container.isEmpty ? "Порожній" :
                              products.find((p) => p.id === container.productId)?.name || "Невідомий продукт"}
                        </td>
                        <td>
                          <Button variant="outline-secondary" title="Edit" onClick={() => navigate(`/tare/update/${container.id}`)} className="p-0 border-0">
                            <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" height="20" />
                          </Button>
                          {container.isEmpty ? (
                              <Button variant="outline-secondary" title="Set Product" onClick={() => handleSetProduct(container.id)} className="p-1 border-0">
                                <img src="/Icons for functions/free-icon-import-7234396.png" alt="Set Product" height="20" />
                              </Button>
                          ) : (
                              <Button variant="outline-secondary" title="Clear Product" onClick={() => handleClearProduct(container.id)} className="p-1 border-0">
                                <img src="/Icons for functions/free-icon-package-1666995.png" alt="Clear Product" height="20" />
                              </Button>
                          )}
                          <Button variant="outline-secondary" title="Delete" onClick={() => handleDelete(container.id)} className="p-1 border-0">
                            <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" height="20" />
                          </Button>
                          <Button variant="outline-secondary" title="Reminder" onClick={() => handleOpenReminderModal(container.id)} className="p-1 border-0">
                            <img src="/Icons for functions/free-icon-remainder-3156999.png" alt="Reminder" height="20" />
                          </Button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
            )}

            <Pagination>
              {Array.from({ length: Math.ceil(filteredContainers.length / itemsPerPage) }, (_, index) => (
                  <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>

        {/* Модалки */}
        <Modal show={showReminderModal} onHide={() => setShowReminderModal(false)}>
          <Modal.Header closeButton><Modal.Title>Створити нагадування</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Назва</Form.Label>
                <Form.Control
                    type="text"
                    value={reminderForm.title}
                    onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Дата</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={reminderForm.dueDate}
                    onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Тип</Form.Label>
                <Form.Control
                    type="text"
                    value={reminderForm.type}
                    onChange={(e) => setReminderForm({ ...reminderForm, type: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReminderModal(false)}>Скасувати</Button>
            <Button variant="primary" onClick={handleCreateReminder}>Зберегти</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
          <Modal.Header closeButton><Modal.Title>Виберіть продукт</Modal.Title></Modal.Header>
          <Modal.Body>
            <Select
                options={products.map((p) => ({ value: p.id, label: p.name }))}
                onChange={(opt) => setSelectedProductId(opt?.value)}
                placeholder="Пошук за назвою"
                isClearable
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>Скасувати</Button>
            <Button variant="primary" onClick={confirmSetProduct}>Підтвердити</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
          <Modal.Header closeButton><Modal.Title>Підтвердження видалення</Modal.Title></Modal.Header>
          <Modal.Body>Ви впевнені, що хочете видалити контейнер?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Ні</Button>
            <Button variant="danger" onClick={confirmDelete}>Так</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showConfirmClearModal} onHide={() => setShowConfirmClearModal(false)}>
          <Modal.Header closeButton><Modal.Title>Підтвердження очищення</Modal.Title></Modal.Header>
          <Modal.Body>Очистити продукт з контейнера?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmClearModal(false)}>Ні</Button>
            <Button variant="danger" onClick={confirmClearProduct}>Так</Button>
          </Modal.Footer>
        </Modal>

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