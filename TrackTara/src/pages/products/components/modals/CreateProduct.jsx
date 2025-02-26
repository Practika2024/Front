import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../../../store/state/actions/productActions';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');
    const [manufactureDate, setManufactureDate] = useState(new Date().toISOString().split('T')[0]); // Поточна дата у форматі YYYY-MM-DD
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            name,
            description,
            manufactureDate: new Date(manufactureDate).toISOString(), // Конвертація у ISO формат
            typeId
        };
        dispatch(addProduct(newProduct));
        navigate('/products');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Manufacture Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={manufactureDate}
                        onChange={(e) => setManufactureDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Type ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;
