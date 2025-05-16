import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductTypes, createProductType, modifyProductType, removeProductType } from '../../store/state/actions/productTypeActions';

const ProductTypesPage = () => {
    const dispatch = useDispatch();
    const { productTypes, loading, error } = useSelector(state => state.productTypes);
    const [newTypeName, setNewTypeName] = useState('');

    useEffect(() => {
        dispatch(fetchProductTypes());
    }, [dispatch]);

    const handleAddProductType = async (e) => {
        e.preventDefault();
        dispatch(createProductType({ name: newTypeName }));
        setNewTypeName('');
    };

    const handleUpdateProductType = (id, productType) => {
        dispatch(modifyProductType(id, productType));
    };

    const handleDeleteProductType = (id) => {
        dispatch(removeProductType(id));
    };

    if (loading) return <div className="table-empty-state">Завантаження...</div>;
    if (error) return <div className="table-empty-state text-danger">Помилка: {error}</div>;

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Типи продуктів</h2>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Список типів продуктів</Card.Title>

                            {productTypes.length === 0 ? (
                                <div className="table-empty-state">Типи продуктів відсутні</div>
                            ) : (
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Назва</th>
                                            <th className="text-center" style={{ width: '100px' }}>Дії</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productTypes.map((type) => (
                                            <tr key={type.id}>
                                                <td className="text-start">{type.name}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="table-action-btn"
                                                        title="Видалити тип продукту"
                                                        onClick={() => handleDeleteProductType(type.id)}
                                                    >
                                                        <img
                                                            src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                                            alt="Delete"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">Додати тип продукту</Card.Title>
                            <Form onSubmit={handleAddProductType}>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        placeholder="Введіть назву типу"
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                        className="mb-3"
                                    />
                                    <Button type="submit" variant="primary" className="w-100">
                                        Додати
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductTypesPage;