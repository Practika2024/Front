import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container className="mt-5">
            <Row className="mb-4 text-center">
                <Col>
                    <h1>Типи продуктів</h1>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Список типів продуктів</Card.Title>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Назва</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {productTypes.map((type) => (
                                    <tr key={type.id}>
                                        <td>{type.name}</td>
                                        <td>
                                            <Button
                                                title={`Видалити тип продукту`}
                                                variant="outline-secondary"
                                                onClick={() => handleDeleteProductType(type.id)}
                                                className="p-1 border-0"
                                            >
                                                <img
                                                    src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                                    alt="Delete"
                                                    height="20"
                                                />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Додати новий тип продукту</Card.Title>
                            <Form onSubmit={handleAddProductType}>
                                <Form.Group controlId="formNewTypeName">
                                    <Form.Label>Назва типу</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-3">Додати</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {error && <div className="error">Error: {error.message}</div>}
        </Container>
    );
};

export default ProductTypesPage;