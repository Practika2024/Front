import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllCarts, addCartToRegistry, validateCartNumber, deleteCartFromRegistry } from '../../utils/services';
import { toast } from 'react-toastify';

const CartRegistry = () => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cartToDelete, setCartToDelete] = useState(null);
    const [newCartNumber, setNewCartNumber] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadCarts();
    }, []);

    const loadCarts = async () => {
        setLoading(true);
        try {
            const data = await getAllCarts();
            setCarts(data);
        } catch (error) {
            console.error('Error loading carts:', error);
            toast.error('Помилка завантаження реєстру поємників');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCart = async (e) => {
        e.preventDefault();
        setError('');

        if (!newCartNumber.trim()) {
            setError('Введіть номер поємника');
            return;
        }

        // Перевірка формату: літера + 3 цифри
        const formatRegex = /^[A-Z]\d{3}$/;
        const normalizedCartNumber = newCartNumber.trim().toUpperCase();
        
        if (!formatRegex.test(normalizedCartNumber)) {
            setError('Невірний формат. Очікується: літера + 3 цифри (наприклад, A123)');
            return;
        }

        // Перевірка, чи вже існує
        const exists = await validateCartNumber(normalizedCartNumber);
        if (exists) {
            setError('Поємник з таким номером вже існує');
            return;
        }

        try {
            await addCartToRegistry(normalizedCartNumber);
            toast.success(`Поємник ${normalizedCartNumber} додано до реєстру`);
            setShowCreateModal(false);
            setNewCartNumber('');
            setError('');
            loadCarts();
        } catch (error) {
            console.error('Error creating cart:', error);
            setError(error.response?.data || 'Помилка додавання поємника');
        }
    };

    const handleDeleteClick = (cartNumber) => {
        setCartToDelete(cartNumber);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!cartToDelete) return;

        try {
            await deleteCartFromRegistry(cartToDelete);
            toast.success(`Поємник ${cartToDelete} видалено з реєстру`);
            setShowDeleteModal(false);
            setCartToDelete(null);
            loadCarts();
        } catch (error) {
            console.error('Error deleting cart:', error);
            toast.error(error.response?.data || 'Помилка видалення поємника');
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Button variant="outline-secondary" onClick={() => navigate('/')} className="me-3">
                        ← Назад
                    </Button>
                    <h2>Реєстр поємників</h2>
                </div>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    + Додати поємник
                </Button>
            </div>

            {loading ? (
                <div className="text-center">Завантаження...</div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Номер поємника</th>
                            <th>Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center text-muted">
                                    Реєстр поємників порожній
                                </td>
                            </tr>
                        ) : (
                            carts.map((cartNumber, index) => (
                                <tr key={cartNumber}>
                                    <td>{index + 1}</td>
                                    <td><strong>{cartNumber}</strong></td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(cartNumber)}
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

            {/* Модальне вікно створення поємника */}
            <Modal show={showCreateModal} onHide={() => {
                setShowCreateModal(false);
                setNewCartNumber('');
                setError('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Додати поємник</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateCart}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Номер поємника</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCartNumber}
                                onChange={(e) => {
                                    setNewCartNumber(e.target.value.toUpperCase());
                                    setError('');
                                }}
                                placeholder="Наприклад: A123"
                                autoFocus
                                style={{ textTransform: 'uppercase' }}
                                maxLength={4}
                            />
                            <Form.Text className="text-muted">
                                Формат: літера + 3 цифри (наприклад, A123, B456)
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowCreateModal(false);
                            setNewCartNumber('');
                            setError('');
                        }}>
                            Скасувати
                        </Button>
                        <Button variant="primary" type="submit">
                            Додати
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Модальне вікно підтвердження видалення */}
            <Modal show={showDeleteModal} onHide={() => {
                setShowDeleteModal(false);
                setCartToDelete(null);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Ви впевнені, що хочете видалити поємник <strong>{cartToDelete}</strong> з реєстру?</p>
                    <Alert variant="warning">
                        Ця дія незворотна. Після видалення поємник не зможе бути використаний при виконанні замовлень.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false);
                        setCartToDelete(null);
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

export default CartRegistry;
