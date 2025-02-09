import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5081/containers/delete/${id}`);
            setTares(tares.filter(tare => tare.id !== id));
            setFilteredTares(filteredTares.filter(tare => tare.id !== id));
        } catch (error) {
            console.error('Error deleting tare:', error);
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
                <Link to="/tare/create" className="btn btn-primary mb-3">Створити новий контейнер</Link>
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
                            <th>Дії</th>
                            <th>Більше інформації</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTares.map((tare) => (
                            <tr key={tare.id}>
                                <td>{tare.name}</td>
                                <td>{getTypeName(tare.type)}</td>
                                <td>{tare.volume}</td>
                                <td>{tare.isEmpty ? 'так' : 'ні'}</td>
                                <td>{tare.notes}</td>
                                <td>
                                    <Row>
                                        <Col>
                                            <Button variant="warning" className="w-100" onClick={() => handleUpdate(tare.id)}>Оновити інформацію</Button>
                                        </Col>
                                        <Col>
                                            <Button variant="danger" className="w-100" onClick={() => handleDelete(tare.id)}>Видалити           </Button>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <Button variant="success" className="w-100" onClick={() => openModal(tare.id)}>Додати продукт</Button>
                                        </Col>
                                        <Col>
                                            <Button variant="secondary" className="w-100" onClick={() => handleClearProduct(tare.id)}>Прибрати продукт</Button>
                                        </Col>
                                    </Row>
                                </td>
                                <td>
                                    <Button variant="info" onClick={() => navigate(`/tare/detail/${tare.id}`)}>Більше інформації</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
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
        </div>
    );
};

export default TareTableContainer;