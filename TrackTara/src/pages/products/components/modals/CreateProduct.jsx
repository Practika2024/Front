import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../../../store/state/actions/productActions';
import { fetchProductTypes } from '../../../../store/state/actions/productTypeActions';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');
    const [manufactureDate, setManufactureDate] = useState(new Date().toISOString().split('T')[0]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productTypes = useSelector(state => state.productTypes.productTypes);

    useEffect(() => {
        dispatch(fetchProductTypes());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProduct = {
            name,
            description,
            manufactureDate: new Date(manufactureDate).toISOString(),
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
                    <label className="form-label">Product Type</label>
                    <select
                        className="form-control"
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        required
                    >
                        <option value="">Select a product type</option>
                        {productTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;