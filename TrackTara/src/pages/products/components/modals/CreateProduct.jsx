import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../../../store/state/actions/productActions';
import { fetchProductTypes, createProductType } from '../../../../store/state/actions/productTypeActions';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');
    const [manufactureDate, setManufactureDate] = useState(new Date().toISOString().split('T')[0]);
    const [showModal, setShowModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productTypes = useSelector(state => state.productTypes.productTypes);

    useEffect(() => {
        dispatch(fetchProductTypes());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProduct = {
            name,
            description,
            manufactureDate: new Date(manufactureDate).toISOString(),
            typeId
        };

        dispatch(addProduct(newProduct));
        navigate('/products');
    };

    const handleCreateType = async () => {
        try {
            const newType = await dispatch(createProductType({ name: newTypeName }));
            if (newType && newType.payload && newType.payload.id) {
                setTypeId(newType.payload.id);
            }
            setShowModal(false);
            dispatch(fetchProductTypes()); // Оновлюємо список після додавання
        } catch (error) {
            console.error('Помилка створення типу продукту:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Додати новий продукт</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Ім'я</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Опис</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Дата виробництва</label>
                    <input
                        type="date"
                        className="form-control"
                        value={manufactureDate}
                        onChange={(e) => setManufactureDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Тип продукту</label>
                    <select
                        className="form-control"
                        value={typeId}
                        onChange={(e) => {
                            if (e.target.value === 'new') {
                                setShowModal(true);
                            } else {
                                setTypeId(e.target.value);
                            }
                        }}
                        required
                    >
                        <option value="">Виберіть тип продукту</option>
                        {productTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                        <option value="new">Створити новий тип</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Додати продукт</button>
            </form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Створити новий тип продукту</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewTypeName">
                            <Form.Label>Назва нового типу</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Закрити</Button>
                    <Button variant="primary" onClick={handleCreateType}>Створити</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateProduct;