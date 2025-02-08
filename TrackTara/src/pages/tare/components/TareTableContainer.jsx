import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const TareTableContainer = () => {
    const [tares, setTares] = useState([]);

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

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Tare List</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Ім'я</th>
                    <th>Тип</th>
                    <th>Об'єм(л)</th>
                    <th>Чи порожній</th>
                    <th>Нотатки</th>
                </tr>
                </thead>
                <tbody>
                {tares.map((tare) => (
                    <tr key={tare.id}>
                        <td>{tare.name}</td>
                        <td>{tare.type}</td>
                        <td>{tare.volume}</td>
                        <td>{tare.isEmpty ? 'так' : 'ні'}</td>
                        <td>{tare.notes}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TareTableContainer;