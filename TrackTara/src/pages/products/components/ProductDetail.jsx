import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../../store/state/actions/productActions';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product.product);
    const status = useSelector((state) => state.product.status);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProductById(productId));
    }, [dispatch, productId]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error loading product</div>;
    }

    return (
        <div className="container mt-5">
            <Card>
                <Card.Header>
                    <h2>Деталі продукту</h2>
                </Card.Header>
                <Card.Body>
                    {product && (
                        <div>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>
                                <strong>Опис:</strong> {product.description}
                            </Card.Text>
                            <Card.Text>
                                <strong>Дата виробництва:</strong> {product.manufactureDate}
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/products/update/${product.id}`)}>
                                Змінити
                            </Button>
                            <Button variant="secondary" className="ms-2" onClick={() => navigate('/products')}>
                                Назад до списку
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductDetail;