import { useEffect, useState } from 'react';
import { Table, Button, Modal,Row, Col, Offcanvas, Pagination } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContainers } from '../../../store/state/actions/containerActions';
import { addProductToContainer, removeProductFromContainer } from '../../../store/state/actions/containerActions';
import { fetchContainerTypes, fetchContainerTypeNameById } from '../../../store/state/actions/containerTypeActions';
import ContainerFilterForm from './ContainerFilterForm.jsx';
import { deleteContainer } from '../../../utils/services/ContainerService.js';
import { Link, useNavigate } from 'react-router-dom';

import { fetchProducts } from '../../../store/state/actions/productActions';
const ContainersTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const containers = useSelector(state => state.containers?.containers || []);
    const products = useSelector(state => state.product?.products || []);


    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedContainerId, setSelectedContainerId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredContainers, setFilteredContainers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [typeNames, setTypeNames] = useState({});
    const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false); // Offcanvas state
    const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);
    const itemsPerPage = 10;
    const handleClearProduct = (id) => {
        setSelectedContainerId(id);
        setShowConfirmClearModal(true);
    };

    const confirmClearProduct = () => {
        dispatch(removeProductFromContainer(selectedContainerId)).then(() => {
            setFilteredContainers(prevContainers =>
                prevContainers.map(container =>
                    container.id === selectedContainerId ? { ...container, productId: null, isEmpty: true } : container
                )
            );
            setShowConfirmClearModal(false);
        });
    };
    useEffect(() => {
        dispatch(fetchContainers());
        dispatch(fetchContainerTypes());
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setFilteredContainers(containers);
    }, [containers]);
    const handleSetProduct = (id) => {
        setSelectedContainerId(id);
        setShowProductModal(true);
    };
    const confirmSetProduct = () => {
        if (selectedProductId) {
            dispatch(addProductToContainer(selectedContainerId, selectedProductId)).then(() => {
                setFilteredContainers(prevContainers =>
                    prevContainers.map(container =>
                        container.id === selectedContainerId ? { ...container, productId: selectedProductId, isEmpty: false } : container
                    )
                );
                setShowProductModal(false);
                setSelectedProductId(null);
            });
        }
    };
    useEffect(() => {
        const fetchTypeNames = async () => {
            const names = { ...typeNames };
            for (const container of containers) {
                if (!names[container.typeId]) {
                    const name = await dispatch(fetchContainerTypeNameById(container.typeId));
                    names[container.typeId] = name;
                }
            }
            setTypeNames(names);
        };
        fetchTypeNames();
    }, [containers, dispatch]);

    const handleDelete = (id) => {
        setSelectedContainerId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteContainer(selectedContainerId);
            setFilteredContainers(prev =>
                prev.filter(container => container.id !== selectedContainerId)
            );
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error deleting container:', error);
        }
    };
    const handleFilter = (filters) => {
        const { uniqueCode, name, minVolume, maxVolume, type, isEmpty } = filters;
        setFilteredContainers(
            containers.filter(container =>
                (!uniqueCode || container.uniqueCode.includes(uniqueCode)) &&
                (!name || container.name.includes(name)) &&
                container.volume >= minVolume &&
                container.volume <= maxVolume &&
                (type.length === 0 || type.includes(String(container.typeId))) &&
                (isEmpty === null || container.isEmpty === isEmpty)
            )
        );
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    const sortedContainers = [...filteredContainers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
            return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
            return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = sortedContainers.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Список контейнерів</h2>
            <div className="text-end mb-3">
                <Link  title={`Додати контейнер `} to="/tare/create" className="btn btn-primary">
                    <img
                        src="public/Icons for functions/free-icon-plus-3303893.png"
                        alt="Create New Container"
                        height="20"
                    />
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
                                <th onClick={() => handleSort('uniqueCode')}>Код</th>
                                <th onClick={() => handleSort('name')}>Ім&apos;я</th>
                                <th onClick={() => handleSort('typeId')}>Тип</th>
                                <th onClick={() => handleSort('volume')}>Об&apos;єм(л)</th>
                                <th>Чи порожній</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map(container => (
                                <tr key={container.id}>
                                    <td>{container.uniqueCode}</td>
                                    <td>{container.name}</td>
                                    <td>{typeNames[container.typeId] || 'Loading...'}</td>
                                    <td>{container.volume}</td>
                                    <td>
                                        {container.isEmpty ? 'Так' : (products.find(p => p.id === container.productId)?.name || 'Невідомий продукт')}
                                    </td>
                                    <td>
                                        <Button
                                            title={`Редагувати контейнер `}
                                            variant="link"
                                            onClick={() => navigate(`/tare/update/${container.id}`)}
                                            className="p-0 border-4"
                                        >

                                            <img
                                                src="/Icons for functions/free-icon-edit-3597088.png"
                                                alt="Edit"
                                                height="20"
                                            />
                                        </Button>
                                        <Button
                                            title={`Видалити контейнер `}
                                            variant="link"
                                            onClick={() => handleDelete(container.id)}
                                            className="p-0 border-4"
                                        >
                                            <img
                                                src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                                alt="Delete"
                                                height="20"
                                            />
                                        </Button>

                                        <Button
                                            title={`Деталі контейнера`}
                                            variant="link"
                                            onClick={() => navigate(`/tare/detail/${container.id}`)}
                                            className="p-0 border-4"
                                        >
                                            <img
                                                src="/Icons for functions/free-icon-info-1445402.png"
                                                alt="Details"
                                                height="20"
                                            />
                                        </Button>
                                        {container.isEmpty ? (
                                            <Button
                                                title={`Set Product`}
                                                variant="link"
                                                onClick={() => handleSetProduct(container.id)}
                                                className="p-0 border-4"
                                            >
                                                <img
                                                    src="/Icons for functions/free-icon-import-7234396.png"
                                                    alt="Set Product"
                                                    height="20"
                                                />
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    title={`Clear Product`}
                                                    variant="link"
                                                    onClick={() => handleClearProduct(container.id)}
                                                    className="p-0 border-4"
                                                >
                                                    <img
                                                        src="/Icons for functions/free-icon-package-1666995.png"
                                                        alt="Clear Product"
                                                        height="20"
                                                    />
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                    <Pagination>
                        {Array.from(
                            { length: Math.ceil(filteredContainers.length / itemsPerPage) },
                            (_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            )
                        )}
                    </Pagination>
                </Col>
            </Row>
            <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Вибір продукту</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Виберіть продукт для додавання до контейнера:</p>
                    <form>
                        {products.map(product => (
                            <div key={product.id} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="product"
                                    id={`product-${product.id}`}
                                    value={product.id}
                                    onChange={() => setSelectedProductId(product.id)}
                                />
                                <label className="form-check-label" htmlFor={`product-${product.id}`}>
                                    {product.name}
                                </label>
                            </div>
                        ))}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={confirmSetProduct}>
                        Підтвердити
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Offcanvas for mobile filters */}
            <Offcanvas
                show={showFilterOffcanvas}
                onHide={() => setShowFilterOffcanvas(false)}
                placement="start"
                className="offcanvas-fullscreen" // Make it full screen
            >
                <Offcanvas.Header>
                    <Button variant="secondary" onClick={() => setShowFilterOffcanvas(false)}>
                        Назад
                    </Button>
                    <Offcanvas.Title className="ms-3">Фільтри</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ContainerFilterForm onFilter={handleFilter} />
                </Offcanvas.Body>
            </Offcanvas>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Ви впевнені, що хочете видалити цей контейнер?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Ні
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Так
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showConfirmClearModal} onHide={() => setShowConfirmClearModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження очищення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Ви впевнені, що хочете очистити продукт з цього контейнера?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmClearModal(false)}>
                        Ні
                    </Button>
                    <Button variant="danger" onClick={confirmClearProduct}>
                        Так
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default ContainersTable;
