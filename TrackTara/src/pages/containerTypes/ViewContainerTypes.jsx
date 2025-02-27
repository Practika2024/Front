import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { getAllContainerTypes, deleteContainerType, createContainerType } from '../../utils/services/ContainerTypesService.js';

const ViewContainerTypes = () => {
    const [containerTypes, setContainerTypes] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContainerTypes();
    }, []);

    const fetchContainerTypes = async () => {
        try {
            const types = await getAllContainerTypes();
            setContainerTypes(types);
        } catch (error) {
            setError(error);
            console.error('Error fetching container types:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteContainerType(id);
            setContainerTypes((prevTypes) => prevTypes.filter((type) => type.id !== id));
        } catch (error) {
            setError(error);
            console.error('Error deleting container type:', error);
        }
    };

    const handleCreateType = async (e) => {
        e.preventDefault();
        try {
            const newType = await createContainerType({ name: newTypeName });
            setContainerTypes((prevTypes) => [...prevTypes, newType]); // Оновлюємо стан
            setNewTypeName('');
        } catch (error) {
            setError(error);
            console.error('Error creating container type:', error);
        }
    };


    return (
        <Container className="mt-5">
            <Row className="mb-4 text-center">
                <Col>
                    <h1>Типи контейнерів</h1>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Список типів контейнерів</Card.Title>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Назва</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {containerTypes.map((type) => (
                                    <tr key={type.id}>
                                        <td>{type.name}</td>
                                        <td>
                                            <Button
                                                title={`Видалити тип контейнера`}
                                                variant="outline-secondary"
                                                onClick={() => handleDelete(type.id)}
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
                            <Card.Title>Додати новий тип контейнера</Card.Title>
                            <Form onSubmit={handleCreateType}>
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

export default ViewContainerTypes;
