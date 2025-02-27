import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../../store/state/actions/productActions';
import { Link } from 'react-router-dom';

const ProductsList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products);
    const status = useSelector((state) => state.product.status);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        setProductToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = () => {
        dispatch(deleteProduct(productToDelete));
        setShowModal(false);
        setProductToDelete(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setProductToDelete(null);
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error loading products</div>;
    }

    if (!Array.isArray(products) || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Назва</th>
                    <th>Опис</th>
                    <th>Дата виробництва</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.manufactureDate}</td>
                        <td>
                            <Link   title={`Деталі продукту`} to={`/product/detail/${product.id}`} className="btn btn-info btn-sm">
                                <img
                                    src="/Icons for functions/free-icon-info-1445402.png"
                                    alt="Details"
                                    height="20"
                                />
                            </Link>
                            <button
                                title={`Видалити продукт`}
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() => handleDelete(product.id)}
                            >
                                <img
                                    src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                    alt="Delete"
                                    height="20"
                                />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this product?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>No</button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsList;
