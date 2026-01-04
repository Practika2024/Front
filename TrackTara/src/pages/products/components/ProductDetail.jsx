import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../../store/state/actions/productActions';
import { fetchAllProductHistories } from '../../../store/state/actions/productHistoryActions';
import { useParams } from 'react-router-dom';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product.product);
    const status = useSelector((state) => state.product.status);
    const productHistory = useSelector((state) => state.productHistory?.histories || []);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProductById(productId));
        dispatch(fetchAllProductHistories(productId));
    }, [dispatch, productId]);
    
    const getActionLabel = (action) => {
        const actionLabels = {
            'created': 'Створено',
            'updated': 'Оновлено',
            'placed_in_container': 'Покладено в тару',
            'removed_from_container': 'Вийнято з тари',
        };
        return actionLabels[action] || action;
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error loading product</div>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-start mb-4">
                <Button variant="secondary" onClick={() => navigate('/products')}>
                    ← Назад до списку
                </Button>
            </div>
            <Row>
                <Col md={4}>
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
                                        <strong>Дата виробництва:</strong> {product.manufactureDate ? new Date(product.manufactureDate).toLocaleDateString('uk-UA') : '-'}
                                    </Card.Text>
                                    {product.containerNumber && (
                                        <Card.Text>
                                            <strong>Номер тари:</strong> {product.containerNumber}
                                        </Card.Text>
                                    )}
                                    <Button variant="primary" onClick={() => navigate(`/product/update/${product.id}`)}>
                                        Змінити
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Історія продукту</Card.Title>
                            {productHistory.length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Дія</th>
                                        <th>Контейнер</th>
                                        <th>Дата</th>
                                        <th>Користувач</th>
                                        <th>Опис</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {productHistory.map((history, index) => (
                                        <tr key={history.id}>
                                            <td>{index + 1}</td>
                                            <td>{getActionLabel(history.action)}</td>
                                            <td>{history.containerId ? `CNT-${String(history.containerId).padStart(3, '0')}` : '-'}</td>
                                            <td>{new Date(history.date).toLocaleString('uk-UA')}</td>
                                            <td>{history.userLogin || '-'}</td>
                                            <td>{history.description || '-'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p>Історія відсутня</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetail;