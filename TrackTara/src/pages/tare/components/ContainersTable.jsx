import { useEffect, useState } from 'react';
import { Table, Button, Modal, Row, Col, Offcanvas, Pagination, Form, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContainers } from '../../../store/state/actions/containerActions';
import { addProductToContainer, removeProductFromContainer } from '../../../store/state/actions/containerActions';
import { fetchContainerTypes, fetchContainerTypeNameById } from '../../../store/state/actions/containerTypeActions';
import ContainerFilterForm from './ContainerFilterForm.jsx';
import { deleteContainer } from '../../../utils/services';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchProducts } from '../../../store/state/actions/productActions';
import { formatQuantity, getUnitLabel } from '../../../utils/helpers/unitFormatter';
const ContainersTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const containers = useSelector(state => state.containers?.containers || []);
    const products = useSelector(state => state.product?.products || []);


    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedContainerId, setSelectedContainerId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [addQuantity, setAddQuantity] = useState('');
    const [removeQuantity, setRemoveQuantity] = useState('');
    const [validationError, setValidationError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredContainers, setFilteredContainers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [typeNames, setTypeNames] = useState({});
    const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false); // Offcanvas state
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmClearModal, setShowConfirmClearModal] = useState(false);
    const itemsPerPage = 10;
    const handleClearProduct = (id) => {
        const container = containers.find(c => c.id === id);
        setSelectedContainerId(id);
        setRemoveQuantity('');
        setValidationError('');
        setShowConfirmClearModal(true);
    };
    
    const getSelectedContainer = () => {
        return containers.find(c => c.id === selectedContainerId);
    };
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        dispatch(fetchContainers());
        dispatch(fetchContainerTypes());
        dispatch(fetchProducts());
    }, [dispatch]);
    const fetchContainerData = () => {
        dispatch(fetchContainers());
    };
    useEffect(() => {
        setFilteredContainers(containers);
    }, [containers]);

    // Автоматично встановлюємо selectedProductId, коли відкривається модальне вікно для не порожнього контейнера
    useEffect(() => {
        if (showProductModal && selectedContainerId) {
            const container = containers.find(c => c.id === selectedContainerId);
            if (container && !container.isEmpty && container.productId) {
                // Якщо контейнер не порожній, встановлюємо продукт, який вже в контейнері
                // Але тільки якщо продукт ще не вибрано користувачем
                if (!selectedProductId) {
                    setSelectedProductId(container.productId);
                }
            }
            // Не очищаємо вибір, якщо користувач вже вибрав продукт для порожнього контейнера
        }
    }, [showProductModal, selectedContainerId, containers]);

    const handleSetProduct = (id) => {
        setSelectedContainerId(id);
        setShowProductModal(true);
    };
    const confirmClearProduct = async () => {
        setValidationError('');
        try {
            const quantity = removeQuantity ? parseFloat(removeQuantity) : null;
            await dispatch(removeProductFromContainer(selectedContainerId, quantity));
            // Якщо досягли цього місця без помилок, операція успішна
            // Оновлюємо контейнери та продукти
            await Promise.all([
                dispatch(fetchContainers()),
                dispatch(fetchProducts())
            ]);
            setShowConfirmClearModal(false);
            setRemoveQuantity('');
            setValidationError('');
        } catch (error) {
            console.error('Error removing product:', error);
            // Показуємо помилку тільки якщо це реальна помилка (не undefined/null)
            if (error) {
                const errorMessage = error?.response?.data || error?.message || 'Помилка вийняття продукту';
                if (errorMessage && errorMessage !== 'undefined') {
                    setValidationError(errorMessage);
                }
            }
        }
    };

    const confirmSetProduct = async () => {
        if (!selectedProductId) {
            setValidationError('Оберіть продукт');
            return;
        }
        setValidationError('');
        try {
            const quantity = addQuantity ? parseFloat(addQuantity) : null;
            await dispatch(addProductToContainer(selectedContainerId, selectedProductId, quantity));
            // Якщо досягли цього місця без помилок, операція успішна
            // Оновлюємо контейнери та продукти
            await Promise.all([
                dispatch(fetchContainers()),
                dispatch(fetchProducts())
            ]);
            setShowProductModal(false);
            setSelectedProductId(null);
            setAddQuantity('');
            setValidationError('');
        } catch (error) {
            console.error('Error adding product:', error);
            // Показуємо помилку тільки якщо це реальна помилка (не undefined/null)
            if (error) {
                const errorMessage = error?.response?.data || error?.message || 'Помилка додавання продукту';
                if (errorMessage && errorMessage !== 'undefined') {
                    setValidationError(errorMessage);
                }
            }
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
        const container = containers.find(container => container.id === id);
        if (container && !container.isEmpty) {
            alert("Спочатку вам потрібно вийняти продукт");
            return;
        }
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
        const { uniqueCode, name, sector, minVolume, maxVolume, type, unitType, isEmpty } = filters;
        setFilteredContainers(
            containers.filter(container =>
                (!uniqueCode || container.uniqueCode.includes(uniqueCode)) &&
                (!name || container.name.includes(name)) &&
                (!sector || container.sector === sector.toUpperCase()) &&
                container.volume >= minVolume &&
                container.volume <= maxVolume &&
                (type.length === 0 || type.includes(String(container.typeId))) &&
                (unitType.length === 0 || unitType.includes(container.unitType || 'liters')) &&
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
                                <th onClick={() => handleSort('sector')}>Сектор</th>
                                <th onClick={() => handleSort('rowNumber')}>Ряд</th>
                                <th onClick={() => handleSort('volume')}>Об&apos;єм</th>
                                <th>Вміст</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map(container => (
                                <tr key={container.id}>
                                    <td>
                                        <a href={`/tare/detail/${container.id}`}>{container.uniqueCode}</a>
                                    </td>
                                    <td>{container.name}</td>
                                    <td>{typeNames[container.typeId] || 'Loading...'}</td>
                                    <td>{container.sector || '-'}</td>
                                    <td>{container.rowNumber || '-'}</td>
                                    <td>{container.volume} {getUnitLabel(container.unitType || 'liters')}</td>
                                    <td>
                                        {container.isEmpty ? 'Порожній' : (
                                            <>
                                                {products.find(p => p.id === container.productId)?.name || 'Невідомий продукт'}
                                                {container.currentQuantity !== undefined && container.currentQuantity > 0 && (
                                                    <span className="text-muted ms-2">({formatQuantity(container.currentQuantity, container.unitType || 'liters')})</span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            title={`Редагувати контейнер `}
                                            variant="outline-secondary"
                                            onClick={() => navigate(`/tare/update/${container.id}`)}
                                            className="p-0 border-0"
                                        >

                                            <img
                                                src="/Icons for functions/free-icon-edit-3597088.png"
                                                alt="Edit"
                                                height="20"
                                            />
                                        </Button>


                                        {container.isEmpty ? (
                                            <Button
                                                title={`Додати продукт`}
                                                variant="outline-secondary"
                                                onClick={() => handleSetProduct(container.id)}
                                                className="p-1 border-0"
                                            >
                                                <img
                                                    src="/Icons for functions/free-icon-import-7234396.png"
                                                    alt="Set Product"
                                                    height="20"
                                                />
                                            </Button>
                                        ) : (
                                            <>
                                                {/* Показуємо кнопку додавання, якщо є вільне місце */}
                                                {(container.volume - (container.currentQuantity || 0)) > 0 && (
                                                    <Button
                                                        title={`Додати продукт`}
                                                        variant="outline-secondary"
                                                        onClick={() => handleSetProduct(container.id)}
                                                        className="p-1 border-0"
                                                    >
                                                        <img
                                                            src="/Icons for functions/free-icon-import-7234396.png"
                                                            alt="Add Product"
                                                            height="20"
                                                        />
                                                    </Button>
                                                )}
                                                <Button
                                                    title="Вийняти продукт"
                                                    variant="outline-secondary"
                                                    onClick={() => handleClearProduct(container.id)}
                                                    className="p-1 border-0"
                                                >
                                                    <img
                                                        src="/Icons for functions/free-icon-package-1666995.png"
                                                        alt="Clear Product"
                                                        height="20"
                                                    />
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            title={`Видалити контейнер `}
                                            variant="outline-secondary"
                                            onClick={() => handleDelete(container.id)}
                                            className="p-15 border-0"
                                        >
                                            <img
                                                src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                                alt="Delete"
                                                height="20"
                                            />
                                        </Button>
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
            <Modal show={showProductModal} onHide={() => {
                setShowProductModal(false);
                setAddQuantity('');
                setValidationError('');
                setSelectedProductId(null);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Додати продукт до контейнера</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {validationError && <Alert variant="danger">{validationError}</Alert>}
                    {(() => {
                        const selectedContainer = getSelectedContainer();
                        const currentQuantity = selectedContainer?.currentQuantity || 0;
                        const availableSpace = (selectedContainer?.volume || 0) - currentQuantity;
                        const isContainerEmpty = selectedContainer?.isEmpty;
                        const existingProductId = selectedContainer?.productId;
                        
                        // Якщо контейнер не порожній, показуємо тільки той продукт, який вже в контейнері
                        const availableProducts = isContainerEmpty 
                            ? products 
                            : products.filter(p => p.id === existingProductId);
                        
                        return (
                            <>
                                {!isContainerEmpty && (
                                    <Alert variant="info" className="mb-3">
                                        <strong>Контейнер вже містить продукт:</strong> {products.find(p => p.id === existingProductId)?.name || 'Невідомий продукт'}<br />
                                        <strong>Поточна кількість:</strong> {formatQuantity(currentQuantity, selectedContainer?.unitType || 'liters')}<br />
                                        <strong>Доступне вільне місце:</strong> {formatQuantity(availableSpace, selectedContainer?.unitType || 'liters')}
                                    </Alert>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label>Оберіть продукт:</Form.Label>
                                    <Select
                                        options={availableProducts.map(product => ({ value: product.id, label: product.name }))}
                                        onChange={(selectedOption) => {
                                            setSelectedProductId(selectedOption?.value || null);
                                            setValidationError('');
                                        }}
                                        placeholder="Оберіть продукт"
                                        isClearable={isContainerEmpty}
                                        isDisabled={!isContainerEmpty} // Якщо контейнер не порожній, не можна змінити продукт
                                        value={
                                            selectedProductId 
                                                ? { value: selectedProductId, label: products.find(p => p.id === selectedProductId)?.name || '' }
                                                : (!isContainerEmpty && existingProductId 
                                                    ? { value: existingProductId, label: products.find(p => p.id === existingProductId)?.name || '' }
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
                                        Кількість ({getUnitLabel(selectedContainer?.unitType || 'liters')}):
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        step={selectedContainer?.unitType === 'pieces' ? '1' : '0.01'}
                                        min="0"
                                        max={availableSpace}
                                        value={addQuantity}
                                        onChange={(e) => {
                                            setAddQuantity(e.target.value);
                                            setValidationError('');
                                        }}
                                        placeholder={`Максимум: ${formatQuantity(availableSpace, selectedContainer?.unitType || 'liters')}`}
                                    />
                                    <Form.Text className="text-muted">
                                        Залишити порожнім, щоб додати максимальну доступну кількість ({formatQuantity(availableSpace, selectedContainer?.unitType || 'liters')})
                                    </Form.Text>
                                </Form.Group>
                            </>
                        );
                    })()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowProductModal(false);
                        setAddQuantity('');
                        setValidationError('');
                    }}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={confirmSetProduct} disabled={!selectedProductId}>
                        Додати продукт
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
            <Modal show={showConfirmClearModal} onHide={() => {
                setShowConfirmClearModal(false);
                setRemoveQuantity('');
                setValidationError('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Вийняти продукт з контейнера</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {validationError && <Alert variant="danger">{validationError}</Alert>}
                    <p>Поточна кількість в контейнері: <strong>{
                        (() => {
                            const container = getSelectedContainer();
                            return container ? formatQuantity(container.currentQuantity || 0, container.unitType || 'liters') : '0';
                        })()
                    }</strong></p>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Кількість для вийняття ({
                                        (() => {
                                            const container = getSelectedContainer();
                                            return getUnitLabel(container?.unitType || 'liters');
                                        })()
                                    }):
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    step={(() => {
                                        const container = getSelectedContainer();
                                        return container?.unitType === 'pieces' ? '1' : '0.01';
                                    })()}
                                    min="0"
                                    max={getSelectedContainer()?.currentQuantity || 0}
                                    value={removeQuantity}
                                    onChange={(e) => {
                                        setRemoveQuantity(e.target.value);
                                        setValidationError('');
                                    }}
                                    placeholder={`Максимум: ${(() => {
                                        const container = getSelectedContainer();
                                        return container ? formatQuantity(container.currentQuantity || 0, container.unitType || 'liters') : '0';
                                    })()}`}
                                />
                                <Form.Text className="text-muted">
                                    Залишити порожнім, щоб вийняти весь продукт ({
                                        (() => {
                                            const container = getSelectedContainer();
                                            return container ? formatQuantity(container.currentQuantity || 0, container.unitType || 'liters') : '0';
                                        })()
                                    })
                                </Form.Text>
                            </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowConfirmClearModal(false);
                        setRemoveQuantity('');
                        setValidationError('');
                    }}>
                        Скасувати
                    </Button>
                    <Button variant="danger" onClick={confirmClearProduct}>
                        Вийняти продукт
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default ContainersTable;