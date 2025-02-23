import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContainerById, updateContainer } from '../../../../utils/services/ContainerService.js';

const UpdateContainer = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [type, setType] = useState(containerTypes[0].id);
    const [volume, setVolume] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContainer = async () => {
            try {
                const tare = await getContainerById(id);
                setName(tare.name);
                setType(tare.type);
                setVolume(tare.volume);
                setNotes(tare.notes);
            } catch (error) {
                console.error('Error fetching tare:', error);
            }
        };

        fetchContainer();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateContainer(id, {
                name,
                type,
                volume,
                notes,
                userId: '56b51b17-0c27-477e-8c55-4f95d3ef7ae1',
            });
            navigate('/tare');
        } catch (error) {
            console.error('Error updating tare:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Update Tare</h2>
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
                <button type="submit" className="btn btn-primary">Оновити інформацію</button>
            </form>
        </div>
    );
};

export default UpdateContainer;