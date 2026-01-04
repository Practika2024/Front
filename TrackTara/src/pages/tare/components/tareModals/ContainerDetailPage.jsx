import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Card, Container, Row, Col, Table, Form, Alert } from 'react-bootstrap';
import Select from 'react-select';
import Loader from '../../../../components/common/loader/Loader.jsx';
import { getContainerById, deleteContainer, setProductToContainer, clearProductFromTare } from '../../../../utils/services';
import { getAllContainerTypes } from '../../../../utils/services';
import { fetchProducts } from '../../../../store/state/actions/productActions.js';
import { fetchAllContainerHistories } from '../../../../store/state/actions/containerHistoryActions.js';
import { useDispatch, useSelector } from 'react-redux';
import { formatQuantity, getUnitLabel, getUnitFullLabel } from '../../../../utils/helpers/unitFormatter';

const ContainerDetailPage = () => {
    const { containerId } = useParams();
    const [container, setContainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const products = useSelector(state => state.product?.products || []);
    const containerHistory = useSelector(state => state.containerHistory?.histories || []);
    const dispatch = useDispatch();

    const [selectedProductId, setSelectedProductId] = useState('');
    const [addQuantity, setAddQuantity] = useState('');
    const [removeQuantity, setRemoveQuantity] = useState('');
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showRemoveProductModal, setShowRemoveProductModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [containerTypes, setContainerTypes] = useState([]);
    const [validationError, setValidationError] = useState('');
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

    // Автоматично встановлюємо selectedProductId, коли відкривається модальне вікно для не порожнього контейнера
    useEffect(() => {
        if (showAddProductModal && container && !container.isEmpty && container.productId) {
            // Встановлюємо продукт, який вже в контейнері, тільки якщо продукт ще не вибрано
            if (!selectedProductId) {
                setSelectedProductId(container.productId);
            }
        }
    }, [showAddProductModal, container]);

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
        if (!selectedProductId) {
            setValidationError('Оберіть продукт');
            return;
        }
        setValidationError('');
        try {
            const quantity = addQuantity ? parseFloat(addQuantity) : null;
            await setProductToContainer(containerId, selectedProductId, quantity);
            setShowAddProductModal(false);
            setSelectedProductId('');
            setAddQuantity('');
            fetchContainerData();
            fetchContainerHistory();
            dispatch(fetchProducts()); // Оновлюємо продукти
        } catch (error) {
            console.error('Error adding product to container:', error);
            setValidationError(error.response?.data || 'Помилка додавання продукту');
        }
    };

    const handleClearProduct = async () => {
        setValidationError('');
        try {
            const quantity = removeQuantity ? parseFloat(removeQuantity) : null;
            await clearProductFromTare(containerId, quantity);
            setShowRemoveProductModal(false);
            setRemoveQuantity('');
            fetchContainerData();
            fetchContainerHistory();
            dispatch(fetchProducts()); // Оновлюємо продукти
        } catch (error) {
            console.error('Error clearing products from container:', error);
            setValidationError(error.response?.data || 'Помилка вийняття продукту');
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
                                <strong>Об'єм:</strong> {container.volume} {getUnitLabel(container.unitType || 'liters')}<br />
                                <strong>Вміст:</strong> {container.isEmpty ? 'Порожній' : (getProductName(container.productId) || 'Невідомий продукт')}<br />
                                {!container.isEmpty && container.currentQuantity !== undefined && (
                                    <>
                                        <strong>Поточна кількість:</strong> {formatQuantity(container.currentQuantity, container.unitType || 'liters')}<br />
                                        <strong>Залишок місця:</strong> {formatQuantity(container.volume - container.currentQuantity, container.unitType || 'liters')}<br />
                                    </>
                                )}
                                <strong>Нотатки:</strong> {container.notes || 'Немає'}
                            </Card.Text>
                            <Button title={`Редагувати контейнер `} variant="outline-secondary" onClick={handleUpdate} className="p-1 border-0">
                                <img src="/Icons for functions/free-icon-edit-3597088.png" alt="Edit" height="20" />
                            </Button>
                            <Button title={`Видалити контейнер `} variant="outline-secondary" onClick={handleDelete} className="p-1 border-0">
                                <img src="/Icons for functions/free-icon-recycle-bin-3156999.png" alt="Delete" height="20" />
                            </Button>
                            {/* Показуємо кнопку додавання, якщо контейнер порожній або є вільне місце */}
                            {(container.isEmpty || (container.volume - (container.currentQuantity || 0)) > 0) && (
                                <Button title={`Додати продукт `} variant="outline-secondary" onClick={() => setShowAddProductModal(true)} className="p-1 border-0">
                                    <img src="/Icons for functions/free-icon-import-7234396.png" alt="Add Product" height="20" />
                                </Button>
                            )}
                            {/* Показуємо кнопку вийняття, якщо контейнер не порожній */}
                            {!container.isEmpty && (
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
                                        <th>Продукт</th>
                                        <th>Дія</th>
                                        <th>Кількість</th>
                                        <th>Дата початку</th>
                                        <th>Дата закінчення</th>
                                        <th>Користувач</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {containerHistory.map((history, index) => (
                                        <tr key={history.id}>
                                            <td>{index + 1}</td>
                                            <td>{history.productId ? getProductName(history.productId) : '-'}</td>
                                            <td>
                                                {history.action === 'created' ? 'Створено' :
                                                 history.action === 'placed' ? 'Покладено' : 
                                                 history.action === 'removed' ? 'Вийнято' : 
                                                 history.action || '-'}
                                            </td>
                                            <td>{history.quantity !== undefined && history.quantity !== null 
                                            ? formatQuantity(history.quantity, container.unitType || 'liters')
                                            : '-'}</td>
                                            <td>{new Date(history.startDate).toLocaleString('uk-UA')}</td>
                                            <td>{history.endDate ? new Date(history.endDate).toLocaleString('uk-UA') : 'Досі в контейнері'}</td>
                                            <td>{history.userLogin || '-'}</td>
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

            <Modal show={showAddProductModal} onHide={() => {
                setShowAddProductModal(false);
                setValidationError('');
                setAddQuantity('');
                setSelectedProductId('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Додати продукт до контейнера</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {validationError && <Alert variant="danger">{validationError}</Alert>}
                    {(() => {
                        const currentQuantity = container?.currentQuantity || 0;
                        const availableSpace = (container?.volume || 0) - currentQuantity;
                        const isContainerEmpty = container?.isEmpty;
                        const existingProductId = container?.productId;
                        
                        // Якщо контейнер не порожній, показуємо тільки той продукт, який вже в контейнері
                        const availableProducts = isContainerEmpty 
                            ? products 
                            : products.filter(p => p.id === existingProductId);
                        
                        return (
                            <>
                                {!isContainerEmpty && (
                                    <Alert variant="info" className="mb-3">
                                        <strong>Контейнер вже містить продукт:</strong> {getProductName(existingProductId) || 'Невідомий продукт'}<br />
                                        <strong>Поточна кількість:</strong> {formatQuantity(currentQuantity, container?.unitType || 'liters')}<br />
                                        <strong>Доступне вільне місце:</strong> {formatQuantity(availableSpace, container?.unitType || 'liters')}
                                    </Alert>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label>Оберіть продукт:</Form.Label>
                                    <Select
                                        options={availableProducts.map(product => ({ value: product.id, label: product.name }))}
                                        onChange={(selectedOption) => {
                                            setSelectedProductId(selectedOption?.value || '');
                                            setValidationError('');
                                        }}
                                        placeholder="Оберіть продукт"
                                        isClearable={isContainerEmpty}
                                        isDisabled={!isContainerEmpty} // Якщо контейнер не порожній, не можна змінити продукт
                                        value={
                                            selectedProductId 
                                                ? { value: selectedProductId, label: getProductName(selectedProductId) || '' }
                                                : (!isContainerEmpty && existingProductId 
                                                    ? { value: existingProductId, label: getProductName(existingProductId) || '' }
                                                    : null
                                                )
                                        }
                                    />
                                    {!isContainerEmpty && (
                                        <Form.Text className="text-muted">
                                            Можна додавати тільки той самий продукт, який вже в контейнері
                                        </Form.Text>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Кількість ({getUnitLabel(container?.unitType || 'liters')}):
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        step={container?.unitType === 'pieces' ? '1' : '0.01'}
                                        min="0"
                                        max={availableSpace}
                                        value={addQuantity}
                                        onChange={(e) => {
                                            setAddQuantity(e.target.value);
                                            setValidationError('');
                                        }}
                                        placeholder={`Максимум: ${formatQuantity(availableSpace, container?.unitType || 'liters')}`}
                                    />
                                    <Form.Text className="text-muted">
                                        Залишити порожнім, щоб додати максимальну доступну кількість ({formatQuantity(availableSpace, container?.unitType || 'liters')})
                                    </Form.Text>
                                </Form.Group>
                            </>
                        );
                    })()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowAddProductModal(false);
                        setValidationError('');
                        setAddQuantity('');
                    }}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleAddProduct} disabled={!selectedProductId}>
                        Додати продукт
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRemoveProductModal} onHide={() => {
                setShowRemoveProductModal(false);
                setValidationError('');
                setRemoveQuantity('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Вийняти продукт з контейнера</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {validationError && <Alert variant="danger">{validationError}</Alert>}
                    <p>Поточна кількість в контейнері: <strong>{formatQuantity(container?.currentQuantity || 0, container?.unitType || 'liters')}</strong></p>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Кількість для вийняття ({getUnitLabel(container?.unitType || 'liters')}):
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    step={container?.unitType === 'pieces' ? '1' : '0.01'}
                                    min="0"
                                    max={container?.currentQuantity || 0}
                                    value={removeQuantity}
                                    onChange={(e) => {
                                        setRemoveQuantity(e.target.value);
                                        setValidationError('');
                                    }}
                                    placeholder={`Максимум: ${formatQuantity(container?.currentQuantity || 0, container?.unitType || 'liters')}`}
                                />
                                <Form.Text className="text-muted">
                                    Залишити порожнім, щоб вийняти весь продукт ({formatQuantity(container?.currentQuantity || 0, container?.unitType || 'liters')})
                                </Form.Text>
                            </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowRemoveProductModal(false);
                        setValidationError('');
                        setRemoveQuantity('');
                    }}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleClearProduct}>
                        Вийняти продукт
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