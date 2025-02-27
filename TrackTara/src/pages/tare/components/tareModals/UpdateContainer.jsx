import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContainerById, updateContainer } from '../../../../utils/services/ContainerService.js';
import { getAllContainerTypes } from '../../../../utils/services/ContainerTypesService.js';
import { Button } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';

const UpdateContainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [volume, setVolume] = useState(0);
    const [notes, setNotes] = useState('');
    const [containerTypes, setContainerTypes] = useState([]);

    useEffect(() => {
        const fetchContainerData = async () => {
            try {
                const container = await getContainerById(id);
                setName(container.name);
                setTypeId(container.typeId);
                setVolume(container.volume);
                setNotes(container.notes);
            } catch (error) {
                console.error('Error fetching container:', error);
            }
        };

        const fetchContainerTypes = async () => {
            try {
                const types = await getAllContainerTypes();
                setContainerTypes(types);
            } catch (error) {
                console.error('Error fetching container types:', error);
            }
        };

        fetchContainerData();
        fetchContainerTypes();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken'); // Отримуємо токен з локального сховища
        if (!token) {
            console.error('JWT token not found in local storage');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const modifiedBy = decodedToken.id; // Витягуємо user ID

            if (!modifiedBy) {
                console.error('User ID not found in token');
                return;
            }

            const updatedData = {
                name,
                volume: Number(volume),
                notes,
                modifiedBy,
                typeId,
            };

            console.log('Decoded Token:', decodedToken);
            console.log('Submitting data:', JSON.stringify(updatedData, null, 2));

            await updateContainer(id, updatedData);
            navigate('/tare');
        } catch (error) {
            console.error('Error decoding token or updating container:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-start mb-4">
                <Button variant="secondary" onClick={() => navigate('/tare')}>
                    ← Назад
                </Button>
            </div>
            <h2 className="mb-4">Оновити тару</h2>
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
                <button type="submit" className="btn btn-primary">
                    Оновити
                </button>
            </form>
        </div>
    );
};

export default UpdateContainer;