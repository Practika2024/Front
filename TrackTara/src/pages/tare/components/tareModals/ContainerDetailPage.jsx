import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Card, Container, Row, Col, Table } from 'react-bootstrap';
import Select from 'react-select';
import Loader from '../../../../components/common/loader/Loader.jsx';
import { getContainerById, deleteContainer, setProductToContainer, clearProductFromTare } from '../../../../utils/services/ContainerService.js';
import { getAllContainerTypes } from '../../../../utils/services/ContainerTypesService.js';
import { fetchProducts } from '../../../../store/state/actions/productActions.js';
import { fetchAllContainerHistories } from '../../../../store/state/actions/containerHistoryActions.js';
import { useDispatch, useSelector } from 'react-redux';

const ContainerDetailPage = () => {
    const { containerId } = useParams();
    const [container, setContainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const products = useSelector(state => state.product?.products || []);
    const containerHistory = useSelector(state => state.containerHistory?.histories || []);
    const dispatch = useDispatch();

    const [selectedProductId, setSelectedProductId] = useState('');
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showRemoveProductModal, setShowRemoveProductModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
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
        fetchContainerHistory();
    }, [containerId, dispatch]);

    const fetchContainerData = async () => {
        try {
            const tare = await getContainerById(containerId);
            setContainer(tare);
        } catch (error) {
            console.error('Error fetching container:', error);
            setError(true);
        }
    };

    const fetchContainerHistory = () => {
        dispatch(fetchAllContainerHistories(containerId));
    };

    const getTypeName = (typeId) => {
        const type = containerTypes.find((containerType) => containerType.id === typeId);
        return type ? type.name : 'Unknown';
    };

    const getProductName = (productId) => {
        const product = products.find((product) => product.id === productId);
        return product ? product.name : 'Unknown';
    };

    const handleUpdate = () => navigate(`/tare/update/${containerId}`);

    const handleDelete = async () => {
        if (!container.isEmpty) {
            alert('Cannot delete a container that contains a product.');
            return;
        }
        setShowConfirmDeleteModal(true);
    };

    const confirmDelete = async () => {
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
            setShowAddProductModal(false);
            fetchContainerData();
            fetchContainerHistory();
        } catch (error) {
            console.error('Error adding product to container:', error);
        }
    };

    const handleClearProduct = async () => {
        try {
            await clearProductFromTare(containerId);
            setShowRemoveProductModal(false);
            fetchContainerData();
            fetchContainerHistory();
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
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{container.name}</Card.Title>
                            <Card.Text>
                                <strong>Тип:</strong> {getTypeName(container.typeId)}<br />
                                <strong>Об'єм (л):</strong> {container.volume}<br />
                                <strong>Вміст:</strong> {container.isEmpty ? 'Порожній' : (getProductName(container.productId) || 'Невідомий продукт')}<br />
                                <strong>Нотатки:</strong> {container.notes || 'Немає'}
                            </Card.Text>
                            <Button title={`Редагувати контейнер `} variant="outline-secondary" onClick={handleUpdate} className="p-1 border-0">
                                <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" height="20" />
                            </Button>
                            <Button title={`Видалити контейнер `} variant="outline-secondary" onClick={handleDelete} className="p-1 border-0">
                                <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" height="20" />
                            </Button>
                            {container.isEmpty ? (
                                <Button title={`Додати продукт `} variant="outline-secondary" onClick={() => setShowAddProductModal(true)} className="p-1 border-0">
                                    <img src="/Icons for functions/free-icon-import-7234396.png" alt="Add Product" height="20" />
                                </Button>
                            ) : (
                                <Button variant="outline-secondary" onClick={() => setShowRemoveProductModal(true)} className="p-1 border-0">
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
                                        <th>Product</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {containerHistory.map((history, index) => (
                                        <tr key={history.id}>
                                            <td>{index + 1}</td>
                                            <td>{getProductName(history.productId)}</td>
                                            <td>{new Date(history.startDate).toLocaleString()}</td>
                                            <td>{history.endDate ? new Date(history.endDate).toLocaleString() : ''}</td>
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

            <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Select a product to add to the container:</p>
                    <Select
                        options={products.map(product => ({ value: product.id, label: product.name }))}
                        onChange={(selectedOption) => setSelectedProductId(selectedOption.value)}
                        placeholder="Search by product name"
                        isClearable
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddProduct} disabled={!selectedProductId}>
                        Add Product
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRemoveProductModal} onHide={() => setShowRemoveProductModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to remove the product from this container?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRemoveProductModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClearProduct}>
                        Remove Product
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this container?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ContainerDetailPage;