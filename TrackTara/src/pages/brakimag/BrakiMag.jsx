import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllBrakiMagItems, removeFromBrakiMag } from '../../utils/services';
import { toast } from 'react-toastify';
import { formatQuantity } from '../../utils/helpers/unitFormatter';

const BrakiMag = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        try {
            const data = await getAllBrakiMagItems();
            setItems(data);
        } catch (error) {
            console.error('Error loading braki mag items:', error);
            toast.error('Помилка завантаження бракімагу');
        } finally {
            setLoading(false);
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
            toast.success(`Товар "${itemToDelete.productName}" видалено з бракімагу`);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Button variant="outline-secondary" onClick={() => navigate('/')} className="me-3">
                        ← Назад
                    </Button>
                    <h2>Бракімаг</h2>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Завантаження...</div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Назва продукту</th>
                            <th>Код продукту</th>
                            <th>Код контейнера</th>
                            <th>Кількість</th>
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
                                <td colSpan="10" className="text-center text-muted">
                                    Бракімаг порожній
                                </td>
                            </tr>
                        ) : (
                            items.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td><strong>{item.productName}</strong></td>
                                    <td>{item.productCode}</td>
                                    <td>{item.containerCode || '—'}</td>
                                    <td>{formatQuantity(item.quantity, item.unitType || 'liters')}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.orderId ? `#${item.orderId}` : '—'}</td>
                                    <td>{item.addedBy}</td>
                                    <td>{new Date(item.addedAt).toLocaleString('uk-UA')}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
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
            )}

            {/* Модальне вікно підтвердження видалення */}
            <Modal show={showDeleteModal} onHide={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Ви впевнені, що хочете видалити товар <strong>{itemToDelete?.productName}</strong> з бракімагу?</p>
                    <Alert variant="warning">
                        Ця дія незворотна.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false);
                        setItemToDelete(null);
                    }}>
                        Скасувати
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Видалити
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default BrakiMag;
