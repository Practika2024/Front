import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import containerTypes from '../../../constants/containerTypes'; // Adjust the path as needed
import TareFilterForm from './TareFilterForm';

const TareTableContainer = () => {
    const [tares, setTares] = useState([]);
    const [filteredTares, setFilteredTares] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTares = async () => {
            try {
                const response = await axios.get('http://localhost:5081/containers/all');
                setTares(response.data);
                setFilteredTares(response.data);
            } catch (error) {
                console.error('Error fetching tares:', error);
            }
        };

        fetchTares();
    }, []);

    const getTypeName = (typeId) => {
        const type = containerTypes.find((containerType) => containerType.id === typeId);
        return type ? type.name : 'Unknown';
    };

    const handleUpdate = (id) => {
        navigate(`/tare/update/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5081/containers/delete/${id}`);
            setTares(tares.filter(tare => tare.id !== id));
            setFilteredTares(filteredTares.filter(tare => tare.id !== id));
        } catch (error) {
            console.error('Error deleting tare:', error);
        }
    };

    const handleFilter = (filters) => {
        const { name, minVolume, maxVolume, type, isEmpty } = filters;
        setFilteredTares(tares.filter(tare =>
            (name ? tare.name.includes(name) : true) &&
            (tare.volume >= minVolume && tare.volume <= maxVolume) &&
            (type.length ? type.includes(tare.type) : true) &&
            (isEmpty !== null ? tare.isEmpty === isEmpty : true)
        ));
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Список контейнерів</h2>
            <Row>
                <Col md={3}>
                    <TareFilterForm onFilter={handleFilter} />
                </Col>
                <Col md={9}>
                    <Link to="/tare/create" className="btn btn-primary mb-3">Створити новий контейнер</Link>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Ім'я</th>
                            <th>Тип</th>
                            <th>Об'єм(л)</th>
                            <th>Чи порожній</th>
                            <th>Нотатки</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTares.map((tare) => (
                            <tr key={tare.id}>
                                <td>{tare.name}</td>
                                <td>{getTypeName(tare.type)}</td>
                                <td>{tare.volume}</td>
                                <td>{tare.isFilling ? 'ні' : 'так'}</td>
                                <td>{tare.notes}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleUpdate(tare.id)}>Оновити інформацію</Button>
                                    <Button variant="danger" onClick={() => handleDelete(tare.id)} className="ms-2">Видалити</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};

export default TareTableContainer;