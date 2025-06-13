import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getContainerById,
    updateContainer,
    updateContainerImage,
} from '../../../../utils/services/ContainerService.js';
import { getAllContainerTypes } from '../../../../utils/services/ContainerTypesService.js';
import { Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const UpdateContainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [volume, setVolume] = useState(0);
    const [notes, setNotes] = useState('');
    const [containerTypes, setContainerTypes] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContainerData = async () => {
            try {
                setLoading(true);
                const response = await getContainerById(id);
                const container = response.payload;
                
                setName(container.name || '');
                setTypeId(container.typeId || '');
                setVolume(container.volume || 0);
                setNotes(container.notes || '');
                setCurrentImage(container.filePath || null);
                setError(null);
            } catch (error) {
                console.error('Error fetching container:', error);
                setError('Помилка завантаження даних контейнера');
            } finally {
                setLoading(false);
            }
        };

        const fetchContainerTypes = async () => {
            try {
                const types = await getAllContainerTypes();
                setContainerTypes(types);
            } catch (error) {
                console.error('Error fetching container types:', error);
                setError('Помилка завантаження типів контейнерів');
            }
        };

        fetchContainerData();
        fetchContainerTypes();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('JWT token не знайдено в локальному сховищі');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const modifiedBy = decodedToken.id;

            if (!modifiedBy) {
                setError('ID користувача не знайдено в токені');
                return;
            }

            const updatedData = {
                name,
                volume: Number(volume),
                notes,
                modifiedBy,
                typeId,
            };

            await updateContainer(id, updatedData);
            navigate('/tare');
        } catch (error) {
            console.error('Error updating container:', error);
            setError('Помилка оновлення контейнера');
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            setError('Файл зображення не вибрано');
            return;
        }

        try {
            await updateContainerImage(id, imageFile);
            // Оновлюємо поточне зображення після успішного завантаження
            const response = await getContainerById(id);
            setCurrentImage(response.payload.filePath);
            setImageFile(null);
            setImagePreviewUrl(null);
            setError(null);
        } catch (error) {
            console.error('Error updating container image:', error);
            setError('Помилка оновлення зображення');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl(null);
        }
    };

    if (loading) return <div className="table-empty-state">Завантаження...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

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
                        <option value="">-- Виберіть тип --</option>
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
                        min="1"
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

            <div className="mt-5">
                <h4>Оновити фотографію</h4>
                {currentImage && (
                    <div className="mb-3">
                        <h5>Поточне зображення:</h5>
                        <img
                            src={currentImage}
                            alt="Поточне зображення контейнера"
                            style={{ maxWidth: '300px', height: 'auto', marginBottom: '1rem' }}
                        />
                    </div>
                )}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                    className="form-control mb-3"
                    onChange={handleImageChange}
                />
                {imagePreviewUrl && (
                    <div className="mb-3">
                        <h5>Попередній перегляд нового зображення:</h5>
                        <img
                            src={imagePreviewUrl}
                            alt="Вибране зображення"
                            style={{ maxWidth: '300px', height: 'auto' }}
                        />
                    </div>
                )}
                <Button variant="primary" onClick={handleImageUpload} disabled={!imageFile}>
                    Оновити фотографію
                </Button>
            </div>
        </div>
    );
};

export default UpdateContainer;
