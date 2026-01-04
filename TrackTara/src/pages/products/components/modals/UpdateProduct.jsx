import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, fetchProductById } from '../../../../store/state/actions/productActions';
import { fetchProductTypes } from '../../../../store/state/actions/productTypeActions';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { extractRowFromCode } from '../../../../utils/helpers/containerCodeParser';

const UpdateProduct = () => {
    const { productId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');
    const [manufactureDate, setManufactureDate] = useState('');
    const [containerNumber, setContainerNumber] = useState('');
    const [validationError, setValidationError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const product = useSelector(state => state.product.product);
    const productTypes = useSelector(state => state.productTypes.productTypes);
    const status = useSelector(state => state.product.status);

    useEffect(() => {
        dispatch(fetchProductById(productId));
        dispatch(fetchProductTypes());
    }, [dispatch, productId]);

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setTypeId(product.typeId || '');
            setManufactureDate(product.manufactureDate ? new Date(product.manufactureDate).toISOString().split('T')[0] : '');
            setContainerNumber(product.containerNumber || '');
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        // Автоматично витягуємо ряд з коду тари, якщо він вказаний
        const rowNumber = containerNumber ? extractRowFromCode(containerNumber) : null;

        const updatedProduct = {
            name,
            description,
            manufactureDate: new Date(manufactureDate).toISOString(),
            typeId,
            containerNumber: containerNumber || null,
            rowNumber: rowNumber, // Автоматично з коду тари
        };

        dispatch(updateProduct({ id: productId, product: updatedProduct }))
            .then(() => {
                toast.success('Продукт оновлено успішно');
                navigate(`/product/detail/${productId}`);
            })
            .catch((error) => {
                toast.error('Помилка оновлення продукту');
                console.error(error);
            });
    };

    if (status === 'loading') {
        return <div className="container mt-5">Завантаження...</div>;
    }

    if (status === 'failed' || !product) {
        return <div className="container mt-5">Помилка завантаження продукту</div>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-start mb-4">
                <Button variant="secondary" onClick={() => navigate(`/product/detail/${productId}`)}>
                    ← Назад
                </Button>
            </div>

            <h2 className="mb-4">Редагувати продукт</h2>
            {validationError && (
                <Alert variant="danger" className="mb-3">
                    {validationError}
                </Alert>
            )}
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
                    <label className="form-label">Номер тари (опціонально)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={containerNumber}
                        onChange={(e) => setContainerNumber(e.target.value)}
                        placeholder="Наприклад: A01-CNT-001"
                    />
                    <small className="form-text text-muted">
                        Вкажіть номер тари, якщо продукт в тарі. Ряд автоматично витягується з коду (A01-CNT-001 → ряд 01)
                    </small>
                </div>
                <button type="submit" className="btn btn-primary">Оновити продукт</button>
            </form>
        </div>
    );
};

export default UpdateProduct;

