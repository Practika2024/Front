import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { getAllContainerTypes, deleteContainerType, createContainerType } from '../../utils/services/ContainerTypesService.js';

const ViewContainerTypes = () => {
    const [containerTypes, setContainerTypes] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContainerTypes();
    }, []);

    const fetchContainerTypes = async () => {
        try {
            setLoading(true);
            const types = await getAllContainerTypes();
            setContainerTypes(types);
            setError(null);
        } catch (error) {
            setError(error);
            console.error('Error fetching container types:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteContainerType(id);
            setContainerTypes((prevTypes) => prevTypes.filter((type) => type.id !== id));
            setError(null);
        } catch (error) {
            setError(error);
            console.error('Error deleting container type:', error);
        }
    };

    const handleCreateType = async (e) => {
        e.preventDefault();
        try {
            const newType = await createContainerType({ name: newTypeName });
            setContainerTypes((prevTypes) => [...prevTypes, newType]);
            setNewTypeName('');
            setError(null);
        } catch (error) {
            setError(error);
            console.error('Error creating container type:', error);
        }
    };

    if (loading) return <div className="table-empty-state">Завантаження...</div>;
    if (error) return <div className="table-empty-state text-danger">Помилка: {error.message}</div>;

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Типи контейнерів</h2>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Список типів контейнерів</Card.Title>

                            {containerTypes.length === 0 ? (
                                <div className="table-empty-state">Типи контейнерів відсутні</div>
                            ) : (
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Назва</th>
                                            <th className="text-center" style={{ width: '100px' }}>Дії</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {containerTypes.map((type) => (
                                            <tr key={type.id}>
                                                <td className="text-start">{type.name}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="table-action-btn"
                                                        title="Видалити тип контейнера"
                                                        onClick={() => handleDelete(type.id)}
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
                            <Card.Title className="mb-3">Додати тип контейнера</Card.Title>
                            <Form onSubmit={handleCreateType}>
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

export default ViewContainerTypes;
