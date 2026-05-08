import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, Alert, Card, Row, Col, Modal } from 'react-bootstrap';
import { OrderService } from '../../utils/services';
import { getAllContainers } from '../../utils/services';
import { fetchProducts } from '../../store/state/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ClientRouteService } from '../../utils/services';
import { formatQuantity, getUnitFullLabel } from '../../utils/helpers/unitFormatter';
import { lineTotalWeightKg, formatWeightKg } from '../../utils/helpers/productWeight';
import useAppRoles from '../../hooks/useAppRoles';

const CreateOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector(state => state.product?.products || []);
    const [containers, setContainers] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // [{productId, containerId, quantity}]
    const [issueLineCode, setIssueLineCode] = useState(''); // лінія пакування / видачі
    const [clients, setClients] = useState([]);
    const [routeMasters, setRouteMasters] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [error, setError] = useState('');

    const userRoles = useAppRoles();
    /**
     * Клієнт обов'язковий для всіх ролей — без нього замовлення не має ні
     * траси, ні лінії пакування, що ламає інтеграцію зі стіл-лініями.
     */
    const salesManagerMustPickClient = true;
    void userRoles;
    
    // Стани для модального вікна введення кількості
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [pendingItem, setPendingItem] = useState(null); // {productId, containerId, productName, containerCode, rowNumber, productCode, maxQuantity}
    const [quantity, setQuantity] = useState('');
    /** Пошук по списку доступних позицій (без урахування регістру) */
    const [productListSearch, setProductListSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    /** Синхронний захист від подвійного submit (подвійний клік / Enter поки запит йде) */
    const submitLockRef = useRef(false);

    useEffect(() => {
        dispatch(fetchProducts());
        loadContainers();
        loadClientsAndRoutes();
    }, [dispatch]);

    const loadClientsAndRoutes = async () => {
        try {
            const [c, r] = await Promise.all([
                ClientRouteService.getClients(),
                ClientRouteService.getRouteMasters(),
            ]);
            setClients(c);
            setRouteMasters(r);
        } catch (e) {
            console.error(e);
        }
    };

    const selectedClient = clients.find((c) => c.id === Number(selectedClientId));
    const packingLineFromClient = selectedClient
        ? routeMasters.find((m) => m.routeCode === selectedClient.routeCode)?.packingLineCode
        : '';

    useEffect(() => {
        if (!selectedClientId) return;
        const c = clients.find((x) => x.id === Number(selectedClientId));
        if (!c) return;
        const line = routeMasters.find((m) => m.routeCode === c.routeCode)?.packingLineCode;
        if (line) setIssueLineCode(line);
    }, [selectedClientId, clients, routeMasters]);

    const loadContainers = async () => {
        try {
            const data = await getAllContainers();
            setContainers(data);
        } catch (error) {
            console.error('Error loading containers:', error);
        }
    };

    // Отримуємо тільки продукти, які знаходяться в контейнерах
    const productsInContainers = products.filter(product => 
        product.containerNumber && containers.some(c => c.uniqueCode === product.containerNumber)
    );

    // Контейнери з усіх секторів (сектор береться з контейнера; замовлення розіб’ються автоматично)
    const pickableContainers = containers
        .filter(
            (c) =>
                !c.isEmpty &&
                c.productId &&
                productsInContainers.some((p) => p.id === c.productId),
        )
        .slice()
        .sort((a, b) => {
            const sa = String(a.sector || '').toUpperCase();
            const sb = String(b.sector || '').toUpperCase();
            if (sa !== sb) return sa.localeCompare(sb);
            return (a.rowNumber || 0) - (b.rowNumber || 0);
        });

    const productSearchNorm = productListSearch.trim().toLowerCase();
    const filteredPickableContainers = productSearchNorm
        ? pickableContainers.filter((container) => {
              const product = products.find((p) => p.id === container.productId);
              if (!product) return false;
              const code =
                  product.productCode ||
                  `PRD-${String(product.id).padStart(3, '0')}`;
              const haystack = [
                  product.name,
                  container.uniqueCode,
                  String(container.sector ?? ''),
                  String(container.rowNumber ?? ''),
                  code,
              ];
              return haystack.some((field) =>
                  String(field).toLowerCase().includes(productSearchNorm),
              );
          })
        : pickableContainers;

    const handleAddItem = (productId, containerId) => {
        const product = products.find(p => p.id === productId);
        const container = containers.find(c => c.id === containerId);
        
        if (!product || !container) return;

        // Перевіряємо, чи продукт вже додано
        if (selectedItems.some(item => item.productId === productId && item.containerId === containerId)) {
            toast.warning('Цей продукт вже додано до замовлення');
            return;
        }

        // Відкриваємо модальне вікно для введення кількості
        const maxQuantity = container.currentQuantity || container.volume;
        setPendingItem({
            productId,
            containerId,
            productName: product.name,
            containerCode: container.uniqueCode,
            rowNumber: container.rowNumber,
            productCode: `PRD-${String(productId).padStart(3, '0')}`,
            maxQuantity,
            weightKg: Number(product.weightKg) || 0,
        });
        setQuantity(maxQuantity.toString());
        setShowQuantityModal(true);
    };

    const handleConfirmQuantity = () => {
        if (!pendingItem) return;

        const quantityValue = parseFloat(quantity);
        if (isNaN(quantityValue) || quantityValue <= 0) {
            toast.error('Введіть коректну кількість');
            return;
        }

        if (quantityValue > pendingItem.maxQuantity) {
            toast.error(`Кількість не може перевищувати ${pendingItem.maxQuantity}`);
            return;
        }

        const container = containers.find(c => c.id === pendingItem.containerId);
        const newItem = {
            productId: pendingItem.productId,
            productName: pendingItem.productName,
            containerId: pendingItem.containerId,
            containerCode: pendingItem.containerCode,
            rowNumber: pendingItem.rowNumber,
            sector: String(container?.sector || '').toUpperCase() || '?',
            productCode: pendingItem.productCode,
            quantity: quantityValue,
            unitType: container?.unitType || 'liters', // Зберігаємо тип одиниць
            weightKg: Number(pendingItem.weightKg) || 0,
        };

        setSelectedItems([...selectedItems, newItem]);
        setShowQuantityModal(false);
        setPendingItem(null);
        setQuantity('');
    };

    const handleEditQuantity = (index) => {
        const item = selectedItems[index];
        const container = containers.find(c => c.id === item.containerId);
        const maxQuantity = container ? (container.currentQuantity || container.volume) : item.quantity;
        
        setPendingItem({
            ...item,
            maxQuantity,
            index, // Зберігаємо індекс для редагування
        });
        setQuantity(item.quantity.toString());
        setShowQuantityModal(true);
    };

    const handleUpdateQuantity = () => {
        if (!pendingItem || pendingItem.index === undefined) return;

        const quantityValue = parseFloat(quantity);
        if (isNaN(quantityValue) || quantityValue <= 0) {
            toast.error('Введіть коректну кількість');
            return;
        }

        if (quantityValue > pendingItem.maxQuantity) {
            toast.error(`Кількість не може перевищувати ${pendingItem.maxQuantity} л/кг`);
            return;
        }

        const updatedItems = [...selectedItems];
        updatedItems[pendingItem.index].quantity = quantityValue;
        setSelectedItems(updatedItems);
        setShowQuantityModal(false);
        setPendingItem(null);
        setQuantity('');
    };

    const handleRemoveItem = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitLockRef.current || isSubmitting) return;

        setError('');

        if (selectedItems.length === 0) {
            setError('Додайте хоча б один продукт до замовлення');
            return;
        }

        if (!selectedClientId || !selectedClient) {
            setError('Оберіть клієнта для замовлення — без нього не визначити трасу і лінію пакування');
            return;
        }

        const line = (packingLineFromClient || issueLineCode).trim();
        if (!line) {
            setError('Не вдалося визначити лінію пакування для обраного клієнта');
            return;
        }

        submitLockRef.current = true;
        setIsSubmitting(true);

        const basePayload = {
            issueLineCode: line,
            packingLineCode: line,
            clientId: selectedClientId ? Number(selectedClientId) : null,
            clientName: selectedClient?.name || null,
            routeCode: selectedClient?.routeCode || null,
        };

        const groups = new Map();
        for (const item of selectedItems) {
            const sec =
                item.sector ||
                String(
                    containers.find((c) => c.id === item.containerId)?.sector || '',
                ).toUpperCase() ||
                '?';
            if (!groups.has(sec)) groups.set(sec, []);
            groups.get(sec).push(item);
        }

        const orderedSectors = [...groups.keys()].sort();

        try {
            for (const sector of orderedSectors) {
                await OrderService.createOrder({
                    ...basePayload,
                    sector,
                    items: groups.get(sector),
                });
            }
            toast.success(
                orderedSectors.length > 1
                    ? `Створено замовлень: ${orderedSectors.length} (${orderedSectors.map((s) => `сектор ${s}`).join(', ')})`
                    : 'Замовлення створено успішно',
            );
            navigate('/');
        } catch (error) {
            console.error('Error creating order:', error);
            setError(error.response?.data || 'Помилка створення замовлення');
        } finally {
            submitLockRef.current = false;
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-start mb-4">
                <Button variant="secondary" onClick={() => navigate('/')}>
                    ← Назад
                </Button>
            </div>

            <h2 className="mb-4">Створити замовлення</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Продукти на складі</Card.Title>
                                <p className="text-muted small mb-3">
                                    Оберіть позиції з будь-яких секторів. Для кожного сектора буде створено окреме замовлення автоматично.
                                </p>

                                <Form.Group className="mb-3">
                                    <Form.Label>Клієнт (обов’язково)</Form.Label>
                                    <Form.Select
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                        required
                                    >
                                        <option value="">— Оберіть клієнта —</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} (траса {c.routeCode})
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Під клієнта закріплена траса; лінія пакування підставляється автоматично.
                                    </Form.Text>
                                </Form.Group>

                                {selectedClient && (
                                    <Alert variant="secondary" className="py-2 small">
                                        Траса: <strong>{selectedClient.routeCode}</strong>
                                        {packingLineFromClient && (
                                            <> · Лінія пакування: <strong>{packingLineFromClient}</strong></>
                                        )}
                                    </Alert>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Лінія пакування / видачі</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={issueLineCode}
                                        onChange={(e) => setIssueLineCode(e.target.value)}
                                        placeholder="Підставляється з траси або вручну"
                                        required
                                        disabled={!!salesManagerMustPickClient && !!packingLineFromClient}
                                    />
                                    <Form.Text className="text-muted">
                                        Для менеджера з продажу береться з довідника трас. Адміністратор може змінити вручну.
                                    </Form.Text>
                                </Form.Group>

                                <div>
                                    <h5 className="h6">Доступні для замовлення</h5>
                                    {pickableContainers.length === 0 ? (
                                        <Alert variant="info">
                                            Немає продуктів у контейнерах для замовлення
                                        </Alert>
                                    ) : (
                                        <>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small text-muted mb-1">
                                                    Пошук (не залежить від капсу)
                                                </Form.Label>
                                                <Form.Control
                                                    type="search"
                                                    value={productListSearch}
                                                    onChange={(e) =>
                                                        setProductListSearch(e.target.value)
                                                    }
                                                    placeholder="Назва, код контейнера, сектор, код товару…"
                                                    autoComplete="off"
                                                />
                                            </Form.Group>
                                            {filteredPickableContainers.length === 0 ? (
                                                <Alert variant="secondary" className="mb-0">
                                                    Нічого не знайдено за запитом «{productListSearch.trim()}»
                                                </Alert>
                                            ) : (
                                        <Table striped bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Сектор</th>
                                                    <th>Продукт</th>
                                                    <th>Контейнер</th>
                                                    <th>Ряд</th>
                                                    <th>Кількість</th>
                                                    <th>Дія</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPickableContainers.map((container) => {
                                                        const product = products.find(p => p.id === container.productId);
                                                        if (!product) return null;
                                                        return (
                                                            <tr key={container.id}>
                                                                <td>{container.sector}</td>
                                                                <td>{product.name}</td>
                                                                <td>{container.uniqueCode}</td>
                                                                <td>{container.rowNumber}</td>
                                                                <td>{formatQuantity(container.currentQuantity || 0, container.unitType || 'liters')}</td>
                                                                <td>
                                                                    <Button
                                                                        variant="success"
                                                                        size="sm"
                                                                        onClick={() => handleAddItem(product.id, container.id)}
                                                                        disabled={selectedItems.some(item => 
                                                                            item.productId === product.id && item.containerId === container.id
                                                                        )}
                                                                    >
                                                                        {selectedItems.some(item => 
                                                                            item.productId === product.id && item.containerId === container.id
                                                                        ) ? 'Додано' : 'Додати'}
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                })}
                                            </tbody>
                                        </Table>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Продукти в замовленні</Card.Title>
                                {selectedItems.length === 0 ? (
                                    <Alert variant="info">
                                        Додайте продукти з таблиці ліворуч до замовлення
                                    </Alert>
                                ) : (
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Сектор</th>
                                                <th>Продукт</th>
                                                <th>Контейнер</th>
                                                <th>Ряд</th>
                                                <th>Кількість</th>
                                                <th>Вага рядка</th>
                                                <th>Дія</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.sector || containers.find((c) => c.id === item.containerId)?.sector || '—'}</td>
                                                    <td>{item.productName}</td>
                                                    <td>{item.containerCode}</td>
                                                    <td>{item.rowNumber}</td>
                                                    <td>
                                                        {(() => {
                                                            const container = containers.find(c => c.id === item.containerId);
                                                            return container 
                                                                ? formatQuantity(item.quantity, container.unitType || 'liters')
                                                                : `${item.quantity} л/кг`;
                                                        })()}
                                                    </td>
                                                    <td>
                                                        {formatWeightKg(
                                                            lineTotalWeightKg(
                                                                item.quantity,
                                                                item.weightKg
                                                            )
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditQuantity(index)}
                                                            className="me-2"
                                                        >
                                                            Змінити кількість
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleRemoveItem(index)}
                                                        >
                                                            Видалити
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                                {selectedItems.length > 0 && (
                                    <p className="small text-muted mb-0 mt-2">
                                        <strong>Загальна вага замовлення (оцінка):</strong>{' '}
                                        {formatWeightKg(
                                            selectedItems.reduce(
                                                (s, it) =>
                                                    s +
                                                    lineTotalWeightKg(
                                                        it.quantity,
                                                        it.weightKg
                                                    ),
                                                0
                                            )
                                        )}
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="mt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={
                            selectedItems.length === 0 ||
                            isSubmitting ||
                            !selectedClientId
                        }
                    >
                        {isSubmitting ? 'Створення…' : 'Створити замовлення'}
                    </Button>
                    {!selectedClientId && (
                        <Form.Text className="text-muted ms-2">
                            Оберіть клієнта вище — без цього замовлення не створиться.
                        </Form.Text>
                    )}
                </div>
            </Form>

            {/* Модальне вікно для введення кількості */}
            <Modal show={showQuantityModal} onHide={() => {
                setShowQuantityModal(false);
                setPendingItem(null);
                setQuantity('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {pendingItem?.index !== undefined ? 'Змінити кількість' : 'Вкажіть кількість'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {pendingItem && (
                        <>
                            <Alert variant="info">
                                <strong>Продукт:</strong> {pendingItem.productName}<br />
                                <strong>Контейнер:</strong> {pendingItem.containerCode}<br />
                                <strong>Вага одиниці:</strong>{' '}
                                {formatWeightKg(pendingItem.weightKg)} (кг/од.)<br />
                                <strong>Доступна кількість:</strong> {
                                    (() => {
                                        const container = containers.find(c => c.id === pendingItem.containerId);
                                        return container 
                                            ? formatQuantity(pendingItem.maxQuantity, container.unitType || 'liters')
                                            : `${pendingItem.maxQuantity} л/кг`;
                                    })()
                                }
                            </Alert>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Кількість для замовлення ({
                                        (() => {
                                            const container = containers.find(c => c.id === pendingItem.containerId);
                                            return container 
                                                ? getUnitFullLabel(container.unitType || 'liters')
                                                : 'літри/кілограми';
                                        })()
                                    })
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    step={(() => {
                                        const container = containers.find(c => c.id === pendingItem.containerId);
                                        return container?.unitType === 'pieces' ? '1' : '0.01';
                                    })()}
                                    min="0.01"
                                    max={pendingItem.maxQuantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder={`Максимум: ${pendingItem.maxQuantity}`}
                                    autoFocus
                                />
                                <Form.Text className="text-muted">
                                    Введіть кількість продукту, яку потрібно замовити (максимум {
                                        (() => {
                                            const container = containers.find(c => c.id === pendingItem.containerId);
                                            return container 
                                                ? formatQuantity(pendingItem.maxQuantity, container.unitType || 'liters')
                                                : `${pendingItem.maxQuantity} л/кг`;
                                        })()
                                    })
                                    . Орієнтовна вага рядка:{" "}
                                    {formatWeightKg(
                                        lineTotalWeightKg(
                                            parseFloat(String(quantity).replace(",", ".")) || 0,
                                            pendingItem.weightKg
                                        )
                                    )}
                                </Form.Text>
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowQuantityModal(false);
                        setPendingItem(null);
                        setQuantity('');
                    }}>
                        Скасувати
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={pendingItem?.index !== undefined ? handleUpdateQuantity : handleConfirmQuantity}
                        disabled={!quantity || parseFloat(quantity) <= 0 || parseFloat(quantity) > (pendingItem?.maxQuantity || 0)}
                    >
                        {pendingItem?.index !== undefined ? 'Оновити' : 'Додати'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateOrder;

