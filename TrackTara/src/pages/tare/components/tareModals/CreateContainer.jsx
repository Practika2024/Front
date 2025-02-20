import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import containerTypes from '../../../../constants/containerTypes.js';
import { Button } from "react-bootstrap";
import { createContainer } from '../../../../utils/services/ContainerService.js';

const CreateContainer = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState(containerTypes[0].id);
    const [volume, setVolume] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createContainer({
                name,
                type,
                volume,
                notes,
                userId: '56b51b17-0c27-477e-8c55-4f95d3ef7ae1',
            });
            navigate('/tare');
        } catch (error) {
            console.error('Error creating tare:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-start mb-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/tare')}
                >
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
                        value={type}
                        onChange={(e) => setType(Number(e.target.value))}
                        required
                    >
                        {containerTypes.map((containerType) => (
                            <option key={containerType.id} value={containerType.id}>
                                {containerType.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Об'єм(л)</label>
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
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
};

export default CreateContainer;