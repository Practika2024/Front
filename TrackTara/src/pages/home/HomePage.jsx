import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { OrderService, SectorService, getAllContainers, validateCartNumber, addToBrakiMag } from '../../utils/services';
import { toast } from 'react-toastify';
import { fetchProducts } from '../../store/state/actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { formatQuantity, getUnitLabel, getUnitFullLabel } from '../../utils/helpers/unitFormatter';

const HomePage = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product?.products || []);
    const [sectors, setSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [orders, setOrders] = useState([]);
    const [containers, setContainers] = useState([]);
    const [showSectorModal, setShowSectorModal] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Стани для вийняття продукту
    const [showPickModal, setShowPickModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [currentContainer, setCurrentContainer] = useState(null);
    const [cartNumber, setCartNumber] = useState(''); // Номер візка
    const [productCode, setProductCode] = useState('');
    const [containerCode, setContainerCode] = useState('');
    const [pickedQuantity, setPickedQuantity] = useState(''); // Кількість, яку виймають (може бути менше за замовлену)
    const [issueLineCode, setIssueLineCode] = useState('');
    const [pickStep, setPickStep] = useState(0); // 0 - введення номера візка, 1 - введення коду продукту, 2 - введення коду контейнера, 3 - введення кількості для вийняття, 4 - введення коду лінії видання (тільки при повному вийнятті)
    const [showChangeCartModal, setShowChangeCartModal] = useState(false); // Модальне вікно для зміни візка
    const [newCartNumber, setNewCartNumber] = useState(''); // Новий номер візка
    const [oldCartIssueLine, setOldCartIssueLine] = useState(''); // Лінія видачі для старого поємника
    const [showBrakiMagModal, setShowBrakiMagModal] = useState(false); // Модальне вікно для додавання до бракімагу
    const [brakiMagQuantity, setBrakiMagQuantity] = useState(''); // Кількість для бракімагу
    const [brakiMagReason, setBrakiMagReason] = useState('Не вистачило товару'); // Причина додавання до бракімагу
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
        loadSectors();
        loadContainers();
        
        // Перевіряємо, чи є збережений сектор в localStorage
        const savedSector = localStorage.getItem('selectedSector');
        if (savedSector) {
            setSelectedSector(savedSector);
            setShowSectorModal(false);
            loadOrders(savedSector);
        }
    }, [dispatch]);

    const loadContainers = async () => {
        try {
            const data = await getAllContainers();
            setContainers(data);
        } catch (error) {
            console.error('Error loading containers:', error);
        }
    };

    const loadSectors = async () => {
        try {
            const data = await SectorService.getAllSectors();
            setSectors(data);
        } catch (error) {
            console.error('Error loading sectors:', error);
        }
    };

    const loadOrders = async (sector) => {
        if (!sector) return;
        try {
            setLoading(true);
            const data = await OrderService.getOrdersBySector(sector);
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Помилка завантаження замовлень');
        } finally {
            setLoading(false);
        }
    };

    const handleSectorSelect = (sector) => {
        setSelectedSector(sector);
        localStorage.setItem('selectedSector', sector);
        setShowSectorModal(false);
        loadOrders(sector);
    };

    const handleChangeSector = () => {
        setSelectedSector('');
        localStorage.removeItem('selectedSector');
        setShowSectorModal(true);
        setOrders([]);
    };

    const handlePickProduct = (order, item) => {
        setCurrentOrder(order);
        setCurrentItem(item);
        setCartNumber('');
        setProductCode('');
        setContainerCode('');
        setPickedQuantity('');
        setIssueLineCode('');
        setPickStep(0); // Починаємо з введення номера візка
        setError('');
        setCurrentContainer(null);
        setShowPickModal(true);
    };

    const handleCartNumberSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!cartNumber.trim()) {
            setError('Введіть номер поємника');
            return;
        }

        // Перевіряємо, чи існує поємник в реєстрі
        try {
            const isValid = await validateCartNumber(cartNumber.trim());
            if (!isValid) {
                setError('Поємник з таким номером не існує в реєстрі. Перевірте правильність введення.');
                return;
            }
            setPickStep(1);
        } catch (error) {
            console.error('Error validating cart number:', error);
            setError('Помилка перевірки номера поємника');
        }
    };

    const handleProductCodeSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!productCode.trim()) {
            setError('Введіть код продукту');
            return;
        }

        // Перевірка коду продукту
        if (productCode.trim() !== currentItem.productCode) {
            setError(`Код продукту не співпадає. Очікується: ${currentItem.productCode}`);
            return;
        }

        setPickStep(2);
    };

    const handleContainerCodeSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!containerCode.trim()) {
            setError('Введіть код контейнера');
            return;
        }

        // Перевірка коду контейнера
        if (containerCode.trim() !== currentItem.containerCode) {
            setError(`Код контейнера не співпадає. Очікується: ${currentItem.containerCode}`);
            return;
        }

        // Знаходимо контейнер для отримання інформації про одиниці вимірювання
        const container = containers.find(c => c.uniqueCode === containerCode.trim());
        if (container) {
            setCurrentContainer(container);
        }

        setPickStep(3);
    };

    const handleQuantityInput = (e) => {
        e.preventDefault();
        setError('');

        if (!pickedQuantity.trim()) {
            setError('Введіть кількість для вийняття');
            return;
        }

        const quantity = parseFloat(pickedQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            setError('Введіть коректну кількість');
            return;
        }

        // Для штук перевіряємо, щоб не було дробів
        if (currentContainer?.unitType === 'pieces' && !Number.isInteger(quantity)) {
            setError('Для штук можна вводити тільки цілі числа');
            return;
        }

        const remainingQuantity = currentItem.quantity - (currentItem.pickedQuantity || 0);
        if (quantity > remainingQuantity) {
            setError(`Кількість не може перевищувати залишок (${remainingQuantity})`);
            return;
        }

        // Якщо виймаємо всю залишкову кількість - переходимо до введення коду лінії видання
        if (quantity === remainingQuantity) {
            setPickStep(4);
        } else {
            // Якщо часткове вийняття - одразу продовжуємо з тим самим візком
            handlePartialPick(quantity);
        }
    };

    const handlePartialPick = async (quantity, needNewCart = false) => {
        try {
            await OrderService.pickProductPartial(
                currentOrder.id,
                currentItem.id,
                productCode.trim(),
                containerCode.trim(),
                quantity,
                cartNumber.trim(), // Передаємо номер візка
                needNewCart // Чи потрібен новий візок
            );
            
            const message = needNewCart 
                ? `Вийнято ${formatQuantity(quantity, currentContainer?.unitType || 'liters')} у візок ${cartNumber}. Візок залишено, введіть новий для продовження.`
                : `Вийнято ${formatQuantity(quantity, currentContainer?.unitType || 'liters')} у візок ${cartNumber}. Замовлення продовжується.`;
            
            toast.success(message);
            
            // Оновлюємо список замовлень та контейнерів
            await loadOrders(selectedSector);
            await loadContainers();
            
            // Оновлюємо поточний елемент замовлення з новими даними
            const updatedOrders = await OrderService.getOrdersBySector(selectedSector);
            const updatedOrder = updatedOrders.find(o => o.id === currentOrder.id);
            if (updatedOrder) {
                const updatedItem = updatedOrder.items.find(i => i.id === currentItem.id);
                if (updatedItem) {
                    setCurrentItem(updatedItem);
                    setCurrentOrder(updatedOrder);
                    // Очищаємо поля для продовження роботи
                    setProductCode('');
                    setContainerCode('');
                    setPickedQuantity('');
                    // Залишаємось на кроку 1 (введення коду продукту)
                    setPickStep(1);
                }
            }
        } catch (error) {
            console.error('Error picking product partially:', error);
            setError(error.response?.data || 'Помилка вийняття продукту');
        }
    };

    const handleIssueLineSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!issueLineCode.trim()) {
            setError('Введіть код лінії видання');
            return;
        }

        try {
            await OrderService.pickProduct(
                currentOrder.id,
                currentItem.id,
                productCode.trim(),
                containerCode.trim(),
                issueLineCode.trim(),
                cartNumber.trim() // Передаємо номер візка
            );
            
            toast.success(`Продукт успішно вийнято. Візок ${cartNumber} залишено на лінії ${issueLineCode}`);
            setShowPickModal(false);
            setPickStep(0);
            setCartNumber('');
            setProductCode('');
            setContainerCode('');
            setPickedQuantity('');
            setIssueLineCode('');
            setError('');
            setCurrentContainer(null);
            
            // Оновлюємо список замовлень та контейнерів
            loadOrders(selectedSector);
            loadContainers();
        } catch (error) {
            console.error('Error picking product:', error);
            setError(error.response?.data || 'Помилка вийняття продукту');
        }
    };

    const handleChangeCart = () => {
        setShowChangeCartModal(true);
        setNewCartNumber('');
        setOldCartIssueLine('');
        setError('');
    };

    const handleConfirmChangeCart = async () => {
        setError('');
        if (!newCartNumber.trim()) {
            setError('Введіть номер нового поємника');
            return;
        }

        // Перевіряємо, чи вказано лінію видачі для старого поємника
        if (!oldCartIssueLine.trim()) {
            setError('Введіть лінію видачі для поточного поємника');
            return;
        }

        // Перевіряємо, чи існує поємник в реєстрі
        try {
            const isValid = await validateCartNumber(newCartNumber.trim());
            if (!isValid) {
                setError('Поємник з таким номером не існує в реєстрі. Перевірте правильність введення.');
                return;
            }

            // Якщо в поточному візку вже є товари, позначаємо його як залишений на лінії
            if (cartNumber && currentOrder) {
                try {
                    await OrderService.markCartAsLeftOnLine(currentOrder.id, cartNumber, oldCartIssueLine.trim());
                } catch (error) {
                    console.error('Error marking cart as left on line:', error);
                }
            }

            // Встановлюємо новий номер візка
            setCartNumber(newCartNumber.trim().toUpperCase());
            setShowChangeCartModal(false);
            setNewCartNumber('');
            setOldCartIssueLine('');
            toast.success(`Поємник змінено на ${newCartNumber.trim().toUpperCase()}. Старий поємник ${cartNumber} залишено на лінії ${oldCartIssueLine.trim()}`);
        } catch (error) {
            console.error('Error validating cart number:', error);
            setError('Помилка перевірки номера поємника');
        }
    };

    const handleClosePickModal = () => {
        setShowPickModal(false);
        setPickStep(0);
        setCartNumber('');
        setProductCode('');
        setContainerCode('');
        setPickedQuantity('');
        setIssueLineCode('');
        setError('');
        setCurrentItem(null);
        setCurrentOrder(null);
        setCurrentContainer(null);
        setShowChangeCartModal(false);
        setNewCartNumber('');
        setOldCartIssueLine('');
        setShowBrakiMagModal(false);
        setBrakiMagQuantity('');
        setBrakiMagReason('Не вистачило товару');
    };

    const handleAddToBrakiMag = async () => {
        if (!brakiMagQuantity.trim()) {
            setError('Введіть кількість для бракімагу');
            return;
        }

        const quantity = parseFloat(brakiMagQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            setError('Введіть коректну кількість');
            return;
        }

        const remainingQuantity = currentItem.quantity - (currentItem.pickedQuantity || 0);
        if (quantity > remainingQuantity) {
            setError(`Кількість не може перевищувати ${formatQuantity(remainingQuantity, currentContainer?.unitType || 'liters')}`);
            return;
        }

        try {
            await addToBrakiMag({
                productId: currentItem.productId,
                productName: currentItem.productName,
                productCode: currentItem.productCode,
                containerCode: currentItem.containerCode,
                quantity: quantity,
                unitType: currentContainer?.unitType || 'liters',
                reason: brakiMagReason,
                orderId: currentOrder?.id || null,
            });

            toast.success(`Додано ${formatQuantity(quantity, currentContainer?.unitType || 'liters')} до бракімагу`);
            setShowBrakiMagModal(false);
            setBrakiMagQuantity('');
            setBrakiMagReason('Не вистачило товару');
            
            // Оновлюємо список замовлень
            await loadOrders(selectedSector);
        } catch (error) {
            console.error('Error adding to braki mag:', error);
            setError(error.response?.data || 'Помилка додавання до бракімагу');
        }
    };

    const handleAddFullItemToBrakiMag = async () => {
        if (!currentItem) return;

        const remainingQuantity = currentItem.quantity - (currentItem.pickedQuantity || 0);
        if (remainingQuantity <= 0) {
            toast.warning('Немає товару для додавання до бракімагу');
            return;
        }

        try {
            // Знаходимо контейнер для отримання інформації про одиниці вимірювання
            const container = containers.find(c => c.uniqueCode === currentItem.containerCode);
            const unitType = container?.unitType || 'liters';

            await addToBrakiMag({
                productId: currentItem.productId,
                productName: currentItem.productName,
                productCode: currentItem.productCode,
                containerCode: currentItem.containerCode,
                quantity: remainingQuantity,
                unitType: unitType,
                reason: 'Не вистачило товару',
                orderId: currentOrder?.id || null,
            });

            toast.success(`Додано повністю позицію (${formatQuantity(remainingQuantity, unitType)}) до бракімагу`);
            
            // Закриваємо модальне вікно та оновлюємо замовлення
            handleClosePickModal();
            await loadOrders(selectedSector);
        } catch (error) {
            console.error('Error adding full item to braki mag:', error);
            setError(error.response?.data || 'Помилка додавання до бракімагу');
        }
    };

    // Використовуємо orders напряму для відображення

    return (
        <Container className="mt-5">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h1>Видача замовлень</h1>
                        {selectedSector && (
                            <div>
                                <Badge bg="info" className="me-2">Сектор: {selectedSector}</Badge>
                                <Button variant="outline-secondary" size="sm" onClick={handleChangeSector}>
                                    Змінити сектор
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Модальне вікно вибору сектора */}
            <Modal show={showSectorModal} onHide={() => {}} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Оберіть сектор</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Сектор</Form.Label>
                            <Form.Select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                            >
                                <option value="">Оберіть сектор</option>
                                {sectors.map(sector => (
                                    <option key={sector.sector} value={sector.sector}>
                                        Сектор {sector.sector}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="primary" 
                        onClick={() => handleSectorSelect(selectedSector)}
                        disabled={!selectedSector}
                    >
                        Продовжити
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальне вікно вийняття продукту */}
            <Modal show={showPickModal} onHide={handleClosePickModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Вийняти продукт</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Кнопка зміни візка */}
                    {cartNumber && pickStep > 0 && (
                        <div className="mb-3 d-flex justify-content-end">
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={handleChangeCart}
                            >
                                Змінити візок ({cartNumber})
                            </Button>
                        </div>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    {currentItem && (
                        <div className="mb-3">
                            <Card>
                                <Card.Body>
                                    <h5>Інформація про продукт</h5>
                                    <p><strong>Назва:</strong> {currentItem.productName}</p>
                                    <p><strong>Очікуваний код продукту:</strong> {currentItem.productCode}</p>
                                    <p><strong>Очікуваний код контейнера:</strong> {currentItem.containerCode}</p>
                                    <p><strong>Ряд:</strong> {currentItem.rowNumber}</p>
                                    <p>
                                        <strong>Куди класти поємнік (лінія видачі):</strong>{' '}
                                        {currentOrder?.issueLineCode || '—'}
                                    </p>
                                    <p><strong>Замовлена кількість:</strong> {
                                        currentContainer 
                                            ? formatQuantity(currentItem.quantity, currentContainer.unitType || 'liters')
                                            : `${currentItem.quantity} л/кг`
                                    }</p>
                                    {currentItem.pickedQuantity > 0 && (
                                        <p><strong>Вже вийнято:</strong> {
                                            currentContainer 
                                                ? formatQuantity(currentItem.pickedQuantity, currentContainer.unitType || 'liters')
                                                : `${currentItem.pickedQuantity} л/кг`
                                        }</p>
                                    )}
                                    <p><strong>Залишилось вийняти:</strong> {
                                        currentContainer 
                                            ? formatQuantity(currentItem.quantity - (currentItem.pickedQuantity || 0), currentContainer.unitType || 'liters')
                                            : `${currentItem.quantity - (currentItem.pickedQuantity || 0)} л/кг`
                                    }</p>
                                </Card.Body>
                            </Card>
                        </div>
                    )}

                    {pickStep === 0 && (
                        <Form onSubmit={handleCartNumberSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Крок 0: Введіть номер поємника</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={cartNumber}
                                    onChange={(e) => {
                                        setCartNumber(e.target.value.toUpperCase());
                                        setError('');
                                    }}
                                    placeholder="Введіть номер поємника (наприклад, A123)"
                                    autoFocus
                                    style={{ textTransform: 'uppercase' }}
                                />
                                <Form.Text className="text-muted">
                                    Вкажіть номер поємника, в який буде покладено товар. Формат: літера + 3 цифри (наприклад, A123)
                                </Form.Text>
                            </Form.Group>
                            <Button type="submit" variant="primary">Далі</Button>
                        </Form>
                    )}

                    {pickStep === 1 && (
                        <Form onSubmit={handleProductCodeSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Крок 1: Введіть код продукту</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={productCode}
                                    onChange={(e) => {
                                        setProductCode(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Наприклад: PRD-001"
                                    autoFocus
                                />
                                <Form.Text className="text-muted">
                                    В майбутньому це буде скануватися штрих-кодом
                                </Form.Text>
                            </Form.Group>
                            <div className="mb-3">
                                <Button 
                                    variant="outline-warning" 
                                    onClick={handleAddFullItemToBrakiMag}
                                    className="w-100"
                                >
                                    Додати всю позицію до бракімагу
                                </Button>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="secondary" onClick={() => setPickStep(0)}>Назад</Button>
                                <Button type="submit" variant="primary">Далі</Button>
                            </div>
                        </Form>
                    )}

                    {pickStep === 2 && (
                        <Form onSubmit={handleContainerCodeSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Крок 2: Введіть код контейнера</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={containerCode}
                                    onChange={(e) => {
                                        setContainerCode(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Наприклад: A01-CNT-001"
                                    autoFocus
                                />
                                <Form.Text className="text-muted">
                                    Введіть код контейнера, з якого виймаєте продукт
                                </Form.Text>
                            </Form.Group>
                            <div className="d-flex gap-2">
                                <Button variant="secondary" onClick={() => setPickStep(1)}>Назад</Button>
                                <Button type="submit" variant="primary">Далі</Button>
                            </div>
                        </Form>
                    )}

                    {pickStep === 3 && (
                        <Form onSubmit={handleQuantityInput}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Крок 3: Введіть кількість для вийняття ({currentContainer ? getUnitFullLabel(currentContainer.unitType || 'liters') : 'літри/кілограми'})
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    step={currentContainer?.unitType === 'pieces' ? '1' : '0.01'}
                                    min={currentContainer?.unitType === 'pieces' ? '1' : '0.01'}
                                    max={currentItem.quantity - (currentItem.pickedQuantity || 0)}
                                    value={pickedQuantity}
                                    onChange={(e) => {
                                        setPickedQuantity(e.target.value);
                                        setError('');
                                    }}
                                    placeholder={`Максимум: ${currentContainer 
                                        ? formatQuantity(currentItem.quantity - (currentItem.pickedQuantity || 0), currentContainer.unitType || 'liters')
                                        : `${currentItem.quantity - (currentItem.pickedQuantity || 0)} л/кг`
                                    }`}
                                    autoFocus
                                />
                                <Form.Text className="text-muted">
                                    Можна вийняти частину продукту. Якщо виймаєте всю кількість, потрібно буде вказати код лінії видання.
                                    <br />
                                    Залишилось вийняти: {currentContainer 
                                        ? formatQuantity(currentItem.quantity - (currentItem.pickedQuantity || 0), currentContainer.unitType || 'liters')
                                        : `${currentItem.quantity - (currentItem.pickedQuantity || 0)} л/кг`
                                    }
                                </Form.Text>
                            </Form.Group>
                            <div className="mb-3">
                                <Button 
                                    variant="outline-warning" 
                                    onClick={() => setShowBrakiMagModal(true)}
                                    className="w-100"
                                >
                                    Додати до бракімагу (якщо не вистачило або не знайшли)
                                </Button>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="secondary" onClick={() => setPickStep(2)}>Назад</Button>
                                <Button type="submit" variant="primary">Продовжити</Button>
                            </div>
                        </Form>
                    )}

                    {pickStep === 4 && (
                        <Form onSubmit={handleIssueLineSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Крок 4: Введіть код лінії видання</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={issueLineCode}
                                    onChange={(e) => {
                                        setIssueLineCode(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Наприклад: LINE-001"
                                    autoFocus
                                />
                                <Form.Text className="text-muted">
                                    Введіть код лінії видання, на яку залишаєте візок {cartNumber}
                                </Form.Text>
                            </Form.Group>
                            <div className="d-flex gap-2">
                                <Button variant="secondary" onClick={() => setPickStep(3)}>Назад</Button>
                                <Button type="submit" variant="success">Завершити</Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Модальне вікно зміни візка */}
            <Modal show={showChangeCartModal} onHide={() => setShowChangeCartModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Змінити візок</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {cartNumber && (
                        <Alert variant="info" className="mb-3">
                            Поточний поємник: <strong>{cartNumber}</strong>
                            {currentOrder && (
                                <div className="mt-2">
                                    <small>Вкажіть лінію видачі, на яку покладено поточний поємник.</small>
                                </div>
                            )}
                        </Alert>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Лінія видачі для поточного поємника ({cartNumber})</Form.Label>
                        <Form.Control
                            type="text"
                            value={oldCartIssueLine}
                            onChange={(e) => {
                                setOldCartIssueLine(e.target.value);
                                setError('');
                            }}
                            placeholder="Наприклад: LINE-001"
                            autoFocus
                        />
                        <Form.Text className="text-muted">
                            Вкажіть лінію видачі, на яку покладено поточний поємник
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Введіть номер нового поємника</Form.Label>
                        <Form.Control
                            type="text"
                            value={newCartNumber}
                            onChange={(e) => {
                                setNewCartNumber(e.target.value.toUpperCase());
                                setError('');
                            }}
                            placeholder="Наприклад: A123"
                            style={{ textTransform: 'uppercase' }}
                        />
                        <Form.Text className="text-muted">
                            Формат: літера + 3 цифри (наприклад, A123, B456)
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowChangeCartModal(false)}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleConfirmChangeCart}>
                        Змінити
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Список замовлень */}
            {loading ? (
                <div className="text-center">Завантаження...</div>
            ) : orders.length === 0 ? (
                <Alert variant="info">
                    {selectedSector 
                        ? `Немає активних замовлень для сектора ${selectedSector}`
                        : 'Оберіть сектор для перегляду замовлень'
                    }
                </Alert>
            ) : (
                <div>
                    {orders.map((order, orderIndex) => (
                        <Card key={order.id} className="mb-4">
                            <Card.Body>
                                <Card.Title>
                                    Замовлення #{order.id} 
                                    {order.issueLineCode && (
                                        <Badge bg="info" className="ms-2">
                                            Лінія видачі: {order.issueLineCode}
                                        </Badge>
                                    )}
                                </Card.Title>
                                {order.issueLineCode && (
                                    <Alert variant="info" className="mb-3">
                                        <strong>Лінія видачі для поємника:</strong> {order.issueLineCode}
                                    </Alert>
                                )}
                                
                                {/* Інформація про візки */}
                                {order.carts && order.carts.length > 0 && (
                                    <div className="mb-3">
                                        <h6>Візки:</h6>
                                        {order.carts.map((cart, cartIndex) => (
                                            <div key={cartIndex} className={`mb-2 p-2 border rounded ${cart.leftOnLine ? 'bg-light' : ''}`}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <strong>Візок: {cart.cartNumber}</strong>
                                                    {cart.leftOnLine && (
                                                        <Badge bg="success">
                                                            Залишено на лінії {cart.issueLineCode || 'видання'}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <ul className="mb-0 mt-2">
                                                    {cart.items.map((cartItem, itemIndex) => {
                                                        const orderItem = order.items.find(i => i.id === cartItem.itemId);
                                                        const container = containers.find(c => c.uniqueCode === cartItem.containerCode);
                                                        return (
                                                            <li key={itemIndex}>
                                                                Контейнер {cartItem.containerCode}: {formatQuantity(cartItem.quantity, container?.unitType || orderItem?.unitType || 'liters')}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Назва продукту</th>
                                            <th>Ряд</th>
                                            <th>Контейнер</th>
                                            <th>Номер продукту</th>
                                            <th>Кількість</th>
                                            <th>Статус</th>
                                            <th>Дія</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => (
                                            <tr key={`${order.id}-${item.id}`}>
                                                <td>{index + 1}</td>
                                                <td>{item.productName}</td>
                                                <td>{item.rowNumber}</td>
                                                <td>{item.containerCode}</td>
                                                <td>{item.productCode}</td>
                                                <td>
                                                    {(() => {
                                                        const container = containers.find(c => c.uniqueCode === item.containerCode);
                                                        const remainingQuantity = item.quantity - (item.pickedQuantity || 0);
                                                        return container 
                                                            ? formatQuantity(remainingQuantity, container.unitType || 'liters')
                                                            : `${remainingQuantity} л/кг`;
                                                    })()}
                                                </td>
                                                <td>
                                                    {item.status === 'pending' && (
                                                        <Badge bg="warning">Очікує</Badge>
                                                    )}
                                                    {item.status === 'in_progress' && (
                                                        <Badge bg="info">В процесі</Badge>
                                                    )}
                                                    {item.status === 'completed' && (
                                                        <Badge bg="success">Завершено</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    {item.status !== 'completed' && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handlePickProduct(order, item)}
                                                        >
                                                            Вийняти
                                                        </Button>
                                                    )}
                                                    {item.status === 'completed' && (
                                                        <span className="text-muted">
                                                            Вийнято: {item.pickedBy} ({new Date(item.pickedAt).toLocaleString('uk-UA')})
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            {/* Модальне вікно додавання до бракімагу */}
            <Modal show={showBrakiMagModal} onHide={() => {
                setShowBrakiMagModal(false);
                setBrakiMagQuantity('');
                setBrakiMagReason('Не вистачило товару');
                setError('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Додати до бракімагу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {currentItem && (
                        <div className="mb-3">
                            <p><strong>Продукт:</strong> {currentItem.productName}</p>
                            <p><strong>Код продукту:</strong> {currentItem.productCode}</p>
                            <p><strong>Код контейнера:</strong> {currentItem.containerCode}</p>
                            <p><strong>Залишилось вийняти:</strong> {
                                currentContainer 
                                    ? formatQuantity(currentItem.quantity - (currentItem.pickedQuantity || 0), currentContainer.unitType || 'liters')
                                    : `${currentItem.quantity - (currentItem.pickedQuantity || 0)} л/кг`
                            }</p>
                        </div>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Кількість для бракімагу</Form.Label>
                        <Form.Control
                            type="number"
                            step={currentContainer?.unitType === 'pieces' ? '1' : '0.01'}
                            min={currentContainer?.unitType === 'pieces' ? '1' : '0.01'}
                            max={currentItem ? (currentItem.quantity - (currentItem.pickedQuantity || 0)) : 0}
                            value={brakiMagQuantity}
                            onChange={(e) => {
                                setBrakiMagQuantity(e.target.value);
                                setError('');
                            }}
                            placeholder="Введіть кількість"
                            autoFocus
                        />
                        <Form.Text className="text-muted">
                            Максимальна кількість: {currentItem && currentContainer 
                                ? formatQuantity(currentItem.quantity - (currentItem.pickedQuantity || 0), currentContainer.unitType || 'liters')
                                : '0'}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Причина</Form.Label>
                        <Form.Select
                            value={brakiMagReason}
                            onChange={(e) => setBrakiMagReason(e.target.value)}
                        >
                            <option value="Не вистачило товару">Не вистачило товару</option>
                            <option value="Не знайшли потрібної кількості">Не знайшли потрібної кількості</option>
                            <option value="Пошкоджений товар">Пошкоджений товар</option>
                            <option value="Інша причина">Інша причина</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowBrakiMagModal(false);
                        setBrakiMagQuantity('');
                        setBrakiMagReason('Не вистачило товару');
                        setError('');
                    }}>
                        Скасувати
                    </Button>
                    <Button variant="warning" onClick={handleAddToBrakiMag}>
                        Додати до бракімагу
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default HomePage;
