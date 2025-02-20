import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import containerTypes from '../../../../constants/containerTypes';
import Loader from '../../../../components/common/loader/Loader.jsx';
import { getContainerById, deleteContainer, setProductToContainer, clearProductFromTare } from '../../../../utils/services/ContainerService.js';
import { getAllProducts } from '../../../../utils/services/ProductService';

const ContainerDetailPage = () => {
    const { containerId } = useParams();
    const [container, setContainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!containerId) return;

        const fetchContainer = async () => {
            try {
                const tare = await getContainerById(containerId);
                setContainer(tare);
            } catch (error) {
                console.error('Error fetching container:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                setProducts(products);
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

    const handleUpdate = () => navigate(`/tare/update/${containerId}`);

    const handleDelete = async () => {
        try {
            await deleteContainer(containerId);
            navigate('/tare');
        } catch (error) {
            console.error('Error deleting container:', error);
        }
    };

    const handleAddProduct = async () => {
        if (!selectedProductId) return;
        try {
            await setProductToContainer(containerId, selectedProductId);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding product to container:', error);
        }
    };

    const handleClearProduct = async () => {
        try {
            await clearProductFromTare(containerId);
        } catch (error) {
            console.error('Error clearing products from container:', error);
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="alert alert-danger">Помилка завантаження даних</div>;
    if (!container) return <div className="alert alert-warning">Контейнер не знайдено</div>;

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-start mb-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/tare')}
                >
                    ← Назад
                </Button>
            </div>

            <h2 className="text-center mb-4">Деталі контейнера</h2>
            <Table striped bordered hover responsive>
                <thead className="table-primary">
                <tr>
                    <th>Ім'я</th>
                    <th>Тип</th>
                    <th>Об'єм (л)</th>
                    <th>Чи порожній</th>
                    <th>Нотатки</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{container.name}</td>
                    <td>{getTypeName(container.type)}</td>
                    <td>{container.volume}</td>
                    <td>{container.isEmpty ? 'Так' : 'Ні'}</td>
                    <td>{container.notes || 'Немає'}</td>
                    <td>
                        <Button variant="link" onClick={handleUpdate} className="p-0 border-4">
                            <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" height="20" />
                        </Button>
                        <Button variant="link" onClick={handleDelete} className="p-0 border-4">
                            <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" height="20" />
                        </Button>
                        <Button variant="link" onClick={() => setShowModal(true)} className="p-0 border-4">
                            <img src="/Icons for functions/free-icon-import-7234396.png" alt="Add Product" height="20" />
                        </Button>
                        <Button variant="link" onClick={handleClearProduct} className="p-0 border-4">
                            <img src="/Icons for functions/free-icon-package-1666995.png" alt="Clear Product" height="20" />
                        </Button>
                        <Button variant="link" onClick={() => navigate(`/tare/info/${containerId}`)} className="p-0 border-4">
                            <img src="/Icons for functions/free-icon-info-1445402.png" alt="Info" height="20" />
                        </Button>
                    </td>
                </tr>
                </tbody>
            </Table>

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
                    <Button variant="primary" onClick={handleAddProduct} disabled={!selectedProductId}>Додати продукт</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ContainerDetailPage;