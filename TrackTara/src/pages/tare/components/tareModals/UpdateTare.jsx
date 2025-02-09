import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import containerTypes from '../../../../constants/containerTypes.js'; // Adjust the path as needed

const UpdateTare = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [type, setType] = useState(containerTypes[0].id);
    const [volume, setVolume] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTare = async () => {
            try {
                const response = await axios.get(`http://localhost:5081/containers/${id}`);
                const tare = response.data;
                setName(tare.name);
                setType(tare.type);
                setVolume(tare.volume);
                setNotes(tare.notes);
            } catch (error) {
                console.error('Error fetching tare:', error);
            }
        };

        fetchTare();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5081/containers/update/${id}`, {
                name,
                type,
                volume,
                notes,
                userId: '56b51b17-0c27-477e-8c55-4f95d3ef7ae1', // Automatically pass userId
            });
            navigate('/tare');
        } catch (error) {
            console.error('Error updating tare:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
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

export default UpdateTare;