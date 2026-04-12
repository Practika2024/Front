import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../../../store/state/actions/productActions';
import { fetchProductTypes } from '../../../../store/state/actions/productTypeActions';
import { useNavigate } from 'react-router-dom';
import { extractRowFromCode } from '../../../../utils/helpers/containerCodeParser';

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');
    const [manufactureDate, setManufactureDate] = useState(new Date().toISOString().split('T')[0]);
    const [containerNumber, setContainerNumber] = useState('');
    const [weightKg, setWeightKg] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productTypes = useSelector(state => state.productTypes.productTypes);

    useEffect(() => {
        dispatch(fetchProductTypes());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Автоматично витягуємо ряд з коду тари, якщо він вказаний
        const rowNumber = containerNumber ? extractRowFromCode(containerNumber) : null;

        const w = parseFloat(String(weightKg).replace(',', '.'));
        const newProduct = {
            name,
            description,
            manufactureDate: new Date(manufactureDate).toISOString(),
            typeId,
            containerNumber: containerNumber || null,
            rowNumber: rowNumber, // Автоматично з коду тари
            weightKg: Number.isFinite(w) && w >= 0 ? w : 0,
        };

        dispatch(addProduct(newProduct));
        navigate('/products');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Додати новий продукт</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Назва</label>
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
                        onChange={(e) => setTypeId(e.target.value)}
                        required
                    >
                        <option value="">Оберіть тип продукту</option>
                        {productTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Вага одиниці, кг</label>
                    <input
                        type="number"
                        className="form-control"
                        min="0"
                        step="0.001"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        placeholder="0"
                    />
                    <small className="form-text text-muted">
                        Маса в кілограмах на 1 одиницю кількості замовлення (1 л, 1 шт, 1 кг тощо) — для розрахунку ваги вантажу та ящиків.
                    </small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Номер тари (опціонально)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={containerNumber}
                        onChange={(e) => setContainerNumber(e.target.value)}
                        placeholder="Наприклад: A01-CNT-001"
                    />
                    <small className="form-text text-muted">
                        Вкажіть номер тари, якщо продукт вже в тарі. Ряд автоматично витягується з коду (A01-CNT-001 → ряд 01)
                    </small>
                </div>
                <button type="submit" className="btn btn-primary">Додати продукт</button>
            </form>
        </div>
    );
};

export default CreateProduct;