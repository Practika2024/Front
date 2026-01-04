import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { createContainer, getAllContainerTypes, createContainerType, SectorService } from '../../../../utils/services';
import { toast } from 'react-toastify';

const CreateContainer = () => {
    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [volume, setVolume] = useState(0);
    const [unitType, setUnitType] = useState('liters'); // 'liters', 'kilograms', 'pieces'
    const [notes, setNotes] = useState('');
    const [rowNumber, setRowNumber] = useState(1);
    const [sector, setSector] = useState('A');
    const [containerTypes, setContainerTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContainerTypes = async () => {
            try {
                const types = await getAllContainerTypes();
                setContainerTypes(types);
            } catch (error) {
                console.error('Error fetching container types:', error);
            }
        };

        fetchContainerTypes();
    }, []);

    const [validationError, setValidationError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        // Валідація сектора та ряду
        try {
            const sectorExists = await SectorService.sectorExists(sector);
            if (!sectorExists) {
                setValidationError(`Сектор "${sector.toUpperCase()}" не існує. Створіть сектор через меню "Інше" → "Управління секторами та рядами"`);
                return;
            }

            const rowExists = await SectorService.rowExistsInSector(sector, rowNumber);
            if (!rowExists) {
                setValidationError(`Ряд ${rowNumber} не існує в секторі "${sector.toUpperCase()}". Додайте ряд через меню "Інше" → "Управління секторами та рядами"`);
                return;
            }

            await createContainer({
                name,
                volume: Number(volume),
                unitType,
                notes,
                typeId,
                rowNumber: Number(rowNumber) || 1,
                sector: sector.toUpperCase(), // Завжди великі літери
            });
            toast.success('Контейнер створено успішно');
            navigate('/tare');
        } catch (error) {
            console.error('Error creating container:', error);
            toast.error('Помилка створення контейнера');
        }
    };

    const handleCreateType = async () => {
        try {
            const newType = await createContainerType({ name: newTypeName });
            if (newType && newType.id) {
                setContainerTypes([...containerTypes, newType]);
                setTypeId(newType.id);
            }
            setShowModal(false);
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error creating container type:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-start mb-4">
                <Button variant="secondary" onClick={() => navigate('/tare')}>
                    ← Назад
                </Button>
            </div>

            <h2 className="mb-4">Створити нову тару</h2>
            {validationError && (
                <Alert variant="danger" className="mb-3">
                    {validationError}
                </Alert>
            )}
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
                    <label className="form-label">Тип</label>
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
                        <option value="" disabled>Оберіть тип</option>
                        {containerTypes.map((containerType) => (
                            containerType && <option key={containerType.id} value={containerType.id}>
                                {containerType.name}
                            </option>
                        ))}
                        <option value="new">Створити новий тип</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Сектор</label>
                    <input
                        type="text"
                        className="form-control"
                        value={sector}
                        onChange={(e) => {
                            // Дозволяємо тільки літери, максимум 1 символ
                            const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
                            setSector(value || 'A');
                        }}
                        placeholder="A"
                        required
                        maxLength={1}
                    />
                    <small className="form-text text-muted">Вкажіть сектор складу (A, B, C, тощо)</small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Ряд</label>
                    <input
                        type="number"
                        className="form-control"
                        value={rowNumber}
                        onChange={(e) => setRowNumber(e.target.value)}
                        min="1"
                        max="99"
                        required
                    />
                    <small className="form-text text-muted">Вкажіть ряд, в якому знаходиться тара (1-99)</small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Тип одиниць вимірювання</label>
                    <select
                        className="form-control"
                        value={unitType}
                        onChange={(e) => setUnitType(e.target.value)}
                        required
                    >
                        <option value="liters">Літри (л)</option>
                        <option value="kilograms">Кілограми (кг)</option>
                        <option value="pieces">Штуки (шт)</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Об'єм ({unitType === 'liters' ? 'л' : unitType === 'kilograms' ? 'кг' : 'шт'})
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        required
                        min="1"
                        step={unitType === 'pieces' ? '1' : '0.01'}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Нотатки</label>
                    <textarea
                        className="form-control"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Створити</button>
            </form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Створити новий тип</Modal.Title>
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

export default CreateContainer;
