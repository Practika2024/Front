import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import containerTypes from '../../../../constants/containerTypes'; // Adjust the path as needed
import Loader from '../../../../components/common/loader/Loader.jsx'; // Adjust the path as needed

const TareDetailPage = () => {
    const { containerId } = useParams();
    const [container, setContainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContainer = async () => {
            try {
                const response = await axios.get(`http://localhost:5081/containers/${containerId}`);
                setContainer(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching container:', error);
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

        fetchContainer();
        fetchProducts();
    }, [containerId]);

    const getTypeName = (typeId) => {
        const type = containerTypes.find((containerType) => containerType.id === typeId);
        return type ? type.name : 'Unknown';
    };

    const handleUpdate = () => {
        navigate(`/tare/update/${containerId}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5081/containers/delete/${containerId}`);
            navigate('/tare');
        } catch (error) {
            console.error('Error deleting container:', error);
        }
    };

    const handleAddProduct = async () => {
        try {
            await axios.put(`http://localhost:5081/containers/set-product/${containerId}`, { productId: selectedProductId });
            setShowModal(false);
            // Optionally, you can fetch the updated container details here
        } catch (error) {
            console.error('Error adding product to container:', error);
        }
    };

    const handleClearProduct = async () => {
        try {
            await axios.put(`http://localhost:5081/containers/clear-product/${containerId}`);
            // Optionally, you can fetch the updated container details here
        } catch (error) {
            console.error('Error clearing products from container:', error);
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="alert alert-danger">Помилка завантаження дани��</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Деталі контейнера</h2>
            <div className="mb-3">
                <strong>Ім&#39;я:</strong> {container.name}
            </div>
            <div className="mb-3">
                <strong>Тип:</strong> {getTypeName(container.type)}
            </div>
            <div className="mb-3">
                <strong>Об&#39;єм(л):</strong> {container.volume}
            </div>
            <div className="mb-3">
                <strong>Чи порожній:</strong> {container.isEmpty ? 'так' : 'ні'}
            </div>
            <div className="mb-3">
                <strong>Нотатки:</strong> {container.notes}
            </div>
            <div className="mb-3">
                <Button variant="warning" onClick={handleUpdate}>Оновити інформацію</Button>
                <Button variant="danger" onClick={handleDelete} className="ms-2">Видалити</Button>
                <Button variant="success" onClick={openModal} className="ms-2">Додати продукт</Button>
                <Button variant="secondary" onClick={handleClearProduct} className="ms-2">Прибрати продукти</Button>
            </div>

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

export default TareDetailPage;