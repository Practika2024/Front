import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import containerTypes from '../../../constants/containerTypes'; // Adjust the path as needed

const TareTableContainer = () => {
    const [tares, setTares] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTares = async () => {
            try {
                const response = await axios.get('http://localhost:5081/containers/all');
                setTares(response.data);
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
        } catch (error) {
            console.error('Error deleting tare:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Tare List</h2>
            <Link to="/tare/create" className="btn btn-primary mb-3">Create New Tare</Link>
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
                {tares.map((tare) => (
                    <tr key={tare.id}>
                        <td>{tare.name}</td>
                        <td>{getTypeName(tare.type)}</td>
                        <td>{tare.volume}</td>
                        <td>{tare.isEmpty ? 'так' : 'ні'}</td>
                        <td>{tare.notes}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleUpdate(tare.id)}>Update</Button>
                            <Button variant="danger" onClick={() => handleDelete(tare.id)} className="ms-2">Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TareTableContainer;