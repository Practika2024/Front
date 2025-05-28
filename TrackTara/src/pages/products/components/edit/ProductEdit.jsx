import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProductById,
    updateProduct,
} from '../../../../store/state/actions/productActions';
import {
    fetchProductTypes,
    createProductType,
} from '../../../../store/state/actions/productTypeActions';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import ProductImages from './components/ProductImages';

const ProductEdit = () => {
    const { productId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');
    const [manufactureDate, setManufactureDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const product = useSelector((state) => state.product.product);
    const productTypes = useSelector((state) => state.productTypes.productTypes);

    useEffect(() => {
        dispatch(fetchProductById(productId));
        dispatch(fetchProductTypes());
    }, [dispatch, productId]);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setManufactureDate(new Date(product.manufactureDate).toISOString().split('T')[0]);
            setTypeId(product.typeId || '');
        }
    }, [product]);

    const handleSubmit = (e, shouldNavigate = false) => {
        e.preventDefault();
        const updatedProduct = {
            id: productId,
            name,
            description,
            manufactureDate: new Date(manufactureDate).toISOString(),
            typeId,
        };
        dispatch(updateProduct(updatedProduct));

        if (shouldNavigate) {
            navigate('/products');
        }
    };

    const handleCreateType = async () => {
        try {
            const newType = await dispatch(createProductType({ name: newTypeName }));
            if (newType?.payload?.id) {
                setTypeId(newType.payload.id);
            }
            setShowModal(false);
            dispatch(fetchProductTypes());
        } catch (error) {
            console.error('Error creating product type:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Product</h2>
            <form onSubmit={(e) => handleSubmit(e, true)}>
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
                        onChange={(e) => {
                            if (e.target.value === 'new') {
                                setShowModal(true);
                            } else {
                                setTypeId(e.target.value);
                            }
                        }}
                        required
                    >
                        <option value="">Select a product type</option>
                        {productTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                        <option value="new">Create new type</option>
                    </select>
                </div>
                <ProductImages shouldNavigate={false} />
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate('/products')}
                >
                    Cancel
                </button>
            </form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Product Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewTypeName">
                            <Form.Label>New Type Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleCreateType}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductEdit;
