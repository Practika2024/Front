import React, { useState, useEffect, useMemo } from 'react';
import { Container, Table, Button, Modal, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    getAllBrakiMagItems,
    removeFromBrakiMag,
    transferBrakiMagToContainer,
    getAllContainers,
} from '../../utils/services';
import { toast } from 'react-toastify';
import { formatQuantity, getUnitFullLabel } from '../../utils/helpers/unitFormatter';
import { lineTotalWeightKg, formatWeightKg } from '../../utils/helpers/productWeight';

const BrakiMag = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnItem, setReturnItem] = useState(null);
    const [returnQty, setReturnQty] = useState('');
    const [returnContainerId, setReturnContainerId] = useState('');
    const [returnError, setReturnError] = useState('');
    const [returnSubmitting, setReturnSubmitting] = useState(false);
    const [listSearch, setListSearch] = useState('');

    useEffect(() => {
        loadItems();
        loadContainers();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        try {
            const data = await getAllBrakiMagItems();
            setItems(data);
        } catch (error) {
            console.error('Error loading braki mag items:', error);
            toast.error('Помилка завантаження реєстру нестач');
        } finally {
            setLoading(false);
        }
    };

    const loadContainers = async () => {
        try {
            const data = await getAllContainers();
            setContainers(data);
        } catch (error) {
            console.error('Error loading containers:', error);
        }
    };

    const eligibleSorted = useMemo(() => {
        if (!returnItem) return [];
        return containers
            .filter((c) => {
                if (c.isEmpty) return true;
                return Number(c.productId) === Number(returnItem.productId);
            })
            .sort((a, b) => {
            const ea = a.isEmpty ? 0 : 1;
            const eb = b.isEmpty ? 0 : 1;
            if (ea !== eb) return ea - eb;
            const sa = String(a.sector || '').toUpperCase();
            const sb = String(b.sector || '').toUpperCase();
            if (sa !== sb) return sa.localeCompare(sb);
            return String(a.uniqueCode || '').localeCompare(String(b.uniqueCode || ''));
            });
    }, [returnItem, containers]);

    const listSearchNorm = listSearch.trim().toLowerCase();
    const filteredItems = useMemo(() => {
        if (!listSearchNorm) return items;
        return items.filter((item) => {
            const fields = [
                item.productName,
                item.productCode,
                item.containerCode,
                item.reason,
                item.addedBy,
                item.orderId != null ? `#${item.orderId}` : '',
                item.orderId != null ? String(item.orderId) : '',
                item.productId != null ? String(item.productId) : '',
            ];
            return fields.some((f) =>
                String(f || '').toLowerCase().includes(listSearchNorm),
            );
        });
    }, [items, listSearchNorm]);

    const openReturnModal = (item) => {
        setReturnItem(item);
        setReturnQty(String(item.quantity));
        setReturnError('');
        const pref = containers.find(
            (c) =>
                item.containerCode &&
                c.uniqueCode === item.containerCode &&
                (c.isEmpty || Number(c.productId) === Number(item.productId)),
        );
        setReturnContainerId(pref ? String(pref.id) : '');
        setShowReturnModal(true);
    };

    const closeReturnModal = () => {
        setShowReturnModal(false);
        setReturnItem(null);
        setReturnQty('');
        setReturnContainerId('');
        setReturnError('');
        setReturnSubmitting(false);
    };

    const handleReturnToContainer = async () => {
        if (!returnItem) return;
        setReturnError('');
        const q = parseFloat(String(returnQty).replace(',', '.'));
        const max = Number(returnItem.quantity) || 0;
        if (!returnContainerId) {
            setReturnError('Оберіть контейнер');
            return;
        }
        if (!(q > 0) || Number.isNaN(q)) {
            setReturnError('Вкажіть коректну кількість');
            return;
        }
        if (q > max + 1e-9) {
            setReturnError(`У записі браку лише ${formatQuantity(max, returnItem.unitType || 'liters')}`);
            return;
        }

        setReturnSubmitting(true);
        try {
            await transferBrakiMagToContainer(returnItem.id, returnContainerId, q);
            toast.success(
                `Покладено ${formatQuantity(q, returnItem.unitType || 'liters')} у контейнер`,
            );
            closeReturnModal();
            await loadItems();
            await loadContainers();
        } catch (error) {
            console.error(error);
            setReturnError(
                typeof error.response?.data === 'string'
                    ? error.response.data
                    : error.response?.data?.message || 'Не вдалося покласти в контейнер',
            );
        } finally {
            setReturnSubmitting(false);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        try {
            await removeFromBrakiMag(itemToDelete.id);
            toast.success(`Товар "${itemToDelete.productName}" видалено з реєстру нестач`);
            setShowDeleteModal(false);
            setItemToDelete(null);
            loadItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(error.response?.data || 'Помилка видалення товару');
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                <div className="d-flex align-items-center flex-wrap gap-2">
                    <Button variant="outline-secondary" onClick={() => navigate('/')} className="me-sm-2">
                        ← Назад
                    </Button>
                    <h2 className="mb-0">Реєстр нестач (бракімаг)</h2>
                </div>
            </div>

            <Alert variant="light" border="secondary" className="small">
                Якщо знайшли брак або недостачу — покладіть його назад у тару кнопкою{' '}
                <strong>«На склад»</strong>: можна забрати не всю кількість з рядка браку.
            </Alert>

            {loading ? (
                <div className="text-center">Завантаження...</div>
            ) : (
                <>
                    {items.length > 0 && (
                        <Form.Group className="mb-3">
                            <Form.Label className="small text-muted mb-1">
                                Пошук (назва, код товару, контейнер, причина, замовлення…)
                            </Form.Label>
                            <Form.Control
                                type="search"
                                value={listSearch}
                                onChange={(e) => setListSearch(e.target.value)}
                                placeholder="Наприклад: PRD-002, хліб, A01-CNT…"
                                autoComplete="off"
                            />
                        </Form.Group>
                    )}
                    <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Назва продукту</th>
                            <th>Код продукту</th>
                            <th>Код контейнера</th>
                            <th>Кількість у браку</th>
                            <th>Вага ряд., кг</th>
                            <th>Причина</th>
                            <th>ID замовлення</th>
                            <th>Додав</th>
                            <th>Дата додавання</th>
                            <th>Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center text-muted">
                                    Реєстр нестач порожній
                                </td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center text-muted">
                                    Нічого не знайдено за запитом «{listSearch.trim()}»
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{item.productName}</strong>
                                    </td>
                                    <td>{item.productCode}</td>
                                    <td>{item.containerCode || '—'}</td>
                                    <td>{formatQuantity(item.quantity, item.unitType || 'liters')}</td>
                                    <td>{formatWeightKg(lineTotalWeightKg(item.quantity, item.weightKg))}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.orderId ? `#${item.orderId}` : '—'}</td>
                                    <td>{item.addedBy}</td>
                                    <td>{new Date(item.addedAt).toLocaleString('uk-UA')}</td>
                                    <td className="text-nowrap">
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            className="me-2 mb-1"
                                            title="Покласти знайдений брак у контейнер (можна частину)"
                                            onClick={() => openReturnModal(item)}
                                        >
                                            На склад
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="mb-1"
                                            onClick={() => handleDeleteClick(item)}
                                        >
                                            Видалити
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                </>
            )}

            <Modal show={showReturnModal} onHide={closeReturnModal} backdrop={returnSubmitting ? 'static' : true}>
                <Modal.Header closeButton={!returnSubmitting}>
                    <Modal.Title>Повернути з браку на склад</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {returnItem && (
                        <>
                            <Alert variant="info" className="py-2 small mb-3">
                                <strong>{returnItem.productName}</strong> · {returnItem.productCode}
                                <br />
                                У браку зараз:{' '}
                                <strong>
                                    {formatQuantity(returnItem.quantity, returnItem.unitType || 'liters')}
                                </strong>
                            </Alert>

                            {returnError && <Alert variant="danger">{returnError}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Label>Скільки забрати з браку і покласти в контейнер</Form.Label>
                                <Form.Control
                                    type="number"
                                    step={returnItem.unitType === 'pieces' ? '1' : '0.01'}
                                    min={0.01}
                                    max={returnItem.quantity}
                                    value={returnQty}
                                    onChange={(e) => setReturnQty(e.target.value)}
                                    disabled={returnSubmitting}
                                />
                                <Form.Text muted>
                                    Одиниці: {getUnitFullLabel(returnItem.unitType || 'liters')}. Можна менше за
                                    повний залишок, якщо знайшли не все.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Контейнер</Form.Label>
                                <Form.Select
                                    value={returnContainerId}
                                    onChange={(e) => setReturnContainerId(e.target.value)}
                                    disabled={returnSubmitting}
                                >
                                    <option value="">— Оберіть контейнер —</option>
                                    {eligibleSorted.map((c) => {
                                        const free = Math.max(
                                            0,
                                            (c.volume || 0) - (c.currentQuantity || 0),
                                        );
                                        const tag = c.isEmpty ? 'порожній' : `вже є цей продукт`;
                                        return (
                                            <option key={c.id} value={c.id}>
                                                {c.uniqueCode} · сектор {c.sector} · {tag} · вільно{' '}
                                                {formatQuantity(free, c.unitType || 'liters')}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                                <Form.Text muted>
                                    Доступні порожні контейнери або ті, де вже лежить цей самий продукт.
                                </Form.Text>
                            </Form.Group>

                            {eligibleSorted.length === 0 && (
                                <Alert variant="warning" className="mt-2 mb-0 small">
                                    Немає підходящої тари: створіть або звільніть контейнер під цей продукт.
                                </Alert>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeReturnModal} disabled={returnSubmitting}>
                        Скасувати
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleReturnToContainer}
                        disabled={
                            returnSubmitting ||
                            !returnContainerId ||
                            eligibleSorted.length === 0
                        }
                    >
                        {returnSubmitting ? 'Збереження…' : 'Покласти в контейнер'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showDeleteModal}
                onHide={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Ви впевнені, що хочете видалити запис про{' '}
                        <strong>{itemToDelete?.productName}</strong> з реєстру нестач?
                    </p>
                    <Alert variant="warning">Ця дія не зачіпає склад — лише запис у реєстрі.</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowDeleteModal(false);
                            setItemToDelete(null);
                        }}
                    >
                        Скасувати
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Видалити запис
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default BrakiMag;
