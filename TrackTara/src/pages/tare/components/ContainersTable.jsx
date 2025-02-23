import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Modal, Form, OverlayTrigger, Tooltip, Pagination, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import containerTypes from '../../../constants/containerTypes';
import ContainerFilterForm from './ContainerFilterForm.jsx';
import Loader from '../../../components/common/loader/Loader';
import { deleteContainer, setProductToContainer, clearProductFromTare } from '../../../utils/services/ContainerService.js';
import useActions from '../../../hooks/useActions.js';
import { useSelector } from 'react-redux';
// import { getAllProducts } from '../../../utils/services/ProductService';

const ContainersTable = () => {
    const { fetchContainers } = useActions();
    const [tares, setTares] = useState([]);
    const [filteredTares, setFilteredTares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedContainerId, setSelectedContainerId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const navigate = useNavigate();


    const containers = useSelector((state) => state.containers.containers) 

    useEffect(() => {
        fetchContainers();
    }, []);

    const getTypeName = (typeId) => {
        const type = containerTypes.find((containerType) => containerType.id === typeId);
        return type ? type.name : 'Unknown';
    };

    const handleUpdate = (id) => {
        navigate(`/tare/update/${id}`);
    };

    const handleDelete = (id) => {
        setSelectedContainerId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (confirmText === 'Видалити') {
            try {
                await deleteContainer(selectedContainerId);
                setTares(tares.filter(tare => tare.id !== selectedContainerId));
                setFilteredTares(filteredTares.filter(tare => tare.id !== selectedContainerId));
                setShowConfirmModal(false);
                setConfirmText('');
            } catch (error) {
                console.error('Error deleting tare:', error);
            }
        }
    };

    const handleFilter = (filters) => {
        const { name, minVolume, maxVolume, type, isEmpty } = filters;
        setFilteredTares(tares.filter(tare =>
            (name ? tare.name.includes(name) : true) &&
            (tare.volume >= minVolume && tare.volume <= maxVolume) &&
            (type.length ? type.includes(tare.type) : true) &&
            (isEmpty !== null ? tare.isEmpty === isEmpty : true)
        ));
    };

    const handleAddProduct = async () => {
        try {
            await setProductToContainer(selectedContainerId, selectedProductId);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding product to container:', error);
        }
    };

    const handleClearProduct = async (containerId) => {
        try {
            await clearProductFromTare(containerId);
        } catch (error) {
            console.error('Error clearing products from container:', error);
        }
    };

    const openModal = (containerId) => {
        setSelectedContainerId(containerId);
        setShowModal(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTares = [...filteredTares].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedTares.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="alert alert-danger">Помилка завантаження даних</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Список контейнерів</h2>
            <div className="text-end">
                <Link to="/tare/create" className="btn btn-primary mb-3">
                    <img src="Icons for functions/free-icon-plus-3303893.png" alt="Create New Container" height="20" />
                </Link>
            </div>
            <Button variant="primary" className="d-lg-none mb-3" onClick={() => setShowOffcanvas(true)}>
                Показати фільтри
            </Button>
            <Row>
                <Col lg={3} className="d-none d-lg-block">
                    <ContainerFilterForm onFilter={handleFilter} />
                </Col>
                <Col lg={9}>
                    {filteredTares.length === 0 ? (
                        <div className="alert alert-warning">Контейнери відсутні</div>
                    ) : (
                        <>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')}>Ім&#39;я</th>
                                    <th onClick={() => handleSort('type')}>Тип</th>
                                    <th onClick={() => handleSort('volume')}>Об&#39;єм(л)</th>
                                    <th onClick={() => handleSort('isEmpty')}>Чи порожній</th>
                                    <th onClick={() => handleSort('notes')}>Нотатки</th>
                                    <th style={{ width: '200px' }}>Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {containers.map((tare) => (
                                    <tr key={tare.id}>
                                        <td>{tare.name}</td>
                                        <td>{getTypeName(tare.type)}</td>
                                        <td>{tare.volume}</td>
                                        <td>{tare.isEmpty ? 'так' : 'ні'}</td>
                                        <td>{tare.notes}</td>
                                        <td style={{ width: '200px' }}>
                                            <Row>
                                                <Col>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Update Container</Tooltip>}
                                                    >
                                                        <Button variant="link" className="p-0 border-0" onClick={() => handleUpdate(tare.id)}>
                                                            <img src="Icons for functions/free-icon-edit-3597088.png" alt="Update Container" height="20" />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </Col>
                                                <Col>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Delete Container</Tooltip>}
                                                    >
                                                        <Button variant="link" className="p-0 border-0" onClick={() => handleDelete(tare.id)}>
                                                            <img src="Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete Container" height="20" />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </Col>
                                            </Row>
                                            <Row className="mt-2">
                                                <Col>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Add Product</Tooltip>}
                                                    >
                                                        <Button variant="link" className="p-0 border-0" onClick={() => openModal(tare.id)}>
                                                            <img src="Icons for functions/free-icon-import-7234396.png" alt="Add Product" height="20" />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </Col>
                                                <Col>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Clear Product</Tooltip>}
                                                    >
                                                        <Button variant="link" className="p-0 border-0" onClick={() => handleClearProduct(tare.id)}>
                                                            <img src="Icons for functions/free-icon-package-1666995.png" alt="Clear Product" height="20" />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </Col>
                                                <Col>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>More Info</Tooltip>}
                                                    >
                                                        <Button variant="link" className="p-0 border-0" onClick={() => navigate(`/tare/detail/${tare.id}`)}>
                                                            <img src="Icons for functions/free-icon-info-1445402.png" alt="More Info" height="20" />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <Pagination>
                                {Array.from({ length: Math.ceil(filteredTares.length / itemsPerPage) }, (_, index) => (
                                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </>
                    )}
                </Col>
            </Row>

            <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Фільтри</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ContainerFilterForm onFilter={handleFilter} />
                </Offcanvas.Body>
            </Offcanvas>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Виберіть продукт</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductSelect">
                            <Form.Label>Продукт</Form.Label>
                            <Form.Control as="select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                                <option value="">Виберіть продукт</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Закрити</Button>
                    <Button variant="primary" onClick={handleAddProduct}>Додати продукт</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formConfirmDelete">
                            <Form.Label>Введіть "Видалити" для підтвердження</Form.Label>
                            <Form.Control
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Скасувати</Button>
                    <Button variant="danger" onClick={confirmDelete}>Видалити</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContainersTable;