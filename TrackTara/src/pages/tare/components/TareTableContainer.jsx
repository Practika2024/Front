import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Modal, Form, OverlayTrigger, Tooltip, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import containerTypes from '../../../constants/containerTypes'; // Adjust the path as needed
import TareFilterForm from './TareFilterForm';
import Loader from '../../../components/common/loader/Loader'; // Adjust the path as needed

const TareTableContainer = () => {
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTares = async () => {
            try {
                const response = await axios.get('http://localhost:5081/containers/all');
                setTares(response.data);
                setFilteredTares(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tares:', error);
                setError(true);
                setLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5081/products/all');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchTares();
        fetchProducts();
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
                await axios.delete(`http://localhost:5081/containers/delete/${selectedContainerId}`);
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
            await axios.put(`http://localhost:5081/containers/set-product/${selectedContainerId}`, { productId: selectedProductId });
            setShowModal(false);
            // Optionally, you can fetch the updated tares list here
        } catch (error) {
            console.error('Error adding product to container:', error);
        }
    };

    const handleClearProduct = async (containerId) => {
        try {
            await axios.put(`http://localhost:5081/containers/clear-product/${containerId}`);
            // Optionally, you can fetch the updated tares list here
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTares.slice(indexOfFirstItem, indexOfLastItem);

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
            <Row>
                <Col md={3}>
                    <TareFilterForm onFilter={handleFilter} />
                </Col>
                <Col md={9}>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Ім&#39;я</th>
                            <th>Тип</th>
                            <th>Об&#39;єм(л)</th>
                            <th>Чи порожній</th>
                            <th>Нотатки</th>
                            <th style={{ width: '200px' }}>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((tare) => (
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
                </Col>
            </Row>

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

export default TareTableContainer;