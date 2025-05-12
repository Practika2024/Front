import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { createContainer } from '../../../../utils/services/ContainerService.js';
import { getAllContainerTypes, createContainerType } from '../../../../utils/services/ContainerTypesService.js';

const CreateContainer = () => {
    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [volume, setVolume] = useState(0);
    const [notes, setNotes] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createContainer({
                name,
                volume: Number(volume),
                notes,
                typeId,
            });
            navigate('/tare');
        } catch (error) {
            console.error('Error creating container:', error);
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
                    <label className="form-label">Об'єм (л)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        required
                        min="1" // Add this line to set the minimum value to 1
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
