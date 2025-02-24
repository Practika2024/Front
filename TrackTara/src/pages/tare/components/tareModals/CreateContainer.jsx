import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { createContainer } from '../../../../utils/services/ContainerService.js';
import { getAllContainerTypes } from '../../../../utils/services/ContainerTypesService.js';

const CreateContainer = () => {
    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [volume, setVolume] = useState(0);
    const [notes, setNotes] = useState('');
    const [containerTypes, setContainerTypes] = useState([]);
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
                        onChange={(e) => setTypeId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Оберіть тип</option>
                        {containerTypes.map((containerType) => (
                            <option key={containerType.id} value={containerType.id}>
                                {containerType.name}
                            </option>
                        ))}
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
        </div>
    );
};

export default CreateContainer;
