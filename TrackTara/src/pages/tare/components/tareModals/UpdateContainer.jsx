import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContainerById, updateContainer } from '../../../../utils/services';
import { getAllContainerTypes } from '../../../../utils/services';
import { Button, Alert } from "react-bootstrap";
import { jwtDecode } from 'jwt-decode';
import { SectorService } from '../../../../utils/services';
import { toast } from 'react-toastify';

const UpdateContainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [volume, setVolume] = useState(0);
    const [unitType, setUnitType] = useState('liters'); // 'liters', 'kilograms', 'pieces'
    const [notes, setNotes] = useState('');
    const [rowNumber, setRowNumber] = useState(1);
    const [sector, setSector] = useState('A');
    const [validationError, setValidationError] = useState('');
    const [containerTypes, setContainerTypes] = useState([]);

    useEffect(() => {
        const fetchContainerData = async () => {
            try {
                const container = await getContainerById(id);
                setName(container.name);
                setTypeId(container.typeId);
                setVolume(container.volume);
                setUnitType(container.unitType || 'liters');
                setNotes(container.notes || '');
                setRowNumber(container.rowNumber || 1);
                setSector(container.sector || 'A');
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
        setValidationError('');

        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('JWT token not found in local storage');
            return;
        }

        try {
            // Валідація сектора та ряду
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

            const decodedToken = jwtDecode(token);
            const modifiedBy = decodedToken.id;

            if (!modifiedBy) {
                console.error('User ID not found in token');
                return;
            }

            const updatedData = {
                name,
                volume: Number(volume),
                unitType,
                notes,
                modifiedBy,
                typeId,
                rowNumber: Number(rowNumber) || 1,
                sector: sector.toUpperCase(),
            };

            await updateContainer(id, updatedData);
            toast.success('Контейнер оновлено успішно');
            navigate('/tare');
        } catch (error) {
            console.error('Error decoding token or updating container:', error);
            toast.error('Помилка оновлення контейнера');
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
                <button type="submit" className="btn btn-primary">
                    Оновити
                </button>
            </form>
        </div>
    );
};

export default UpdateContainer;