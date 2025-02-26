// src/pages/products/components/ProductsList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../../store/state/actions/productActions';
import { Link } from 'react-router-dom';

const ProductsList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products);
    const status = useSelector((state) => state.product.status);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
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
                    <th>Name</th>
                    <th>Description</th>
                    <th>Manufacture Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.manufactureDate}</td>
                        <td>
                            <Link to={`/product/detail/${product.id}`} className="btn btn-info btn-sm me-2">
                                <img
                                    src="/Icons for functions/free-icon-info-1445402.png"
                                    alt="Details"
                                    height="20"
                                />
                            </Link>
                            <button
                                className="btn btn-danger btn-sm"
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
        </div>
    );
};

export default ProductsList;
