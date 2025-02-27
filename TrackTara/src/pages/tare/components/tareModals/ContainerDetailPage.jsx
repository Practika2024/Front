import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Card, Container } from 'react-bootstrap';
import Loader from '../../../../components/common/loader/Loader.jsx';
import { getContainerById, deleteContainer, setProductToContainer, clearProductFromTare } from '../../../../utils/services/ContainerService.js';
import { getAllContainerTypes } from '../../../../utils/services/ContainerTypesService.js';
import { fetchProducts } from '../../../../store/state/actions/productActions.js';
import { useDispatch, useSelector } from 'react-redux';

const ContainerDetailPage = () => {
    const { containerId } = useParams();
    const [container, setContainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const products = useSelector(state => state.product?.products || []);
    const dispatch = useDispatch();

    const [selectedProductId, setSelectedProductId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [containerTypes, setContainerTypes] = useState([]);
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

        const fetchContainerTypes = async () => {
            try {
                const types = await getAllContainerTypes();
                setContainerTypes(types);
            } catch (error) {
                console.error('Error fetching container types:', error);
            }
        };

        fetchContainer();
        dispatch(fetchProducts());
        fetchContainerTypes();
    }, [containerId, dispatch]);

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
                <Button variant="secondary" onClick={() => navigate('/tare')}>
                    ← Назад
                </Button>
            </div>

            <h2 className="text-center mb-4">Деталі контейнера</h2>
            <Card>
                <Card.Body>
                    <Card.Title>{container.name}</Card.Title>
                    <Card.Text>
                        <strong>Тип:</strong> {getTypeName(container.typeId)}<br />
                        <strong>Об'єм (л):</strong> {container.volume}<br />
                        <strong>Вміст:</strong> {container.isEmpty ? 'Порожній' : (products.find(p => p.id === container.productId)?.name || 'Невідомий продукт')}<br />
                        <strong>Нотатки:</strong> {container.notes || 'Немає'}
                    </Card.Text>
                    <Button title={`Редагувати контейнер `} variant="link" onClick={handleUpdate} className="p-0 border-4">
                        <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" height="20" />
                    </Button>
                    <Button title={`Видалити контейн��р `} variant="link" onClick={handleDelete} className="p-0 border-4">
                        <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" height="20" />
                    </Button>
                    <Button title={`Додати продукт `} variant="link" onClick={() => setShowModal(true)} className="p-0 border-4">
                        <img src="/Icons for functions/free-icon-import-7234396.png" alt="Add Product" height="20" />
                    </Button>
                    <Button variant="link" onClick={handleClearProduct} className="p-0 border-4">
                        <img src="/Icons for functions/free-icon-package-1666995.png" alt="Clear Product" height="20" />
                    </Button>

                </Card.Body>
            </Card>

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