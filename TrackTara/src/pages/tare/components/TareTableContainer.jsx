// src/pages/tare/components/TareTableContainer.jsx
import React, { useEffect, useState } from 'react';
import { TareService } from '../../../utils/services/TareService';

const TareTableContainer = () => {
    const [tares, setTares] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTares = async () => {
            try {
                const data = await TareService.getTares();
                setTares(data);
            } catch (error) {
                console.error('Error fetching tares:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTares();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Tare List</h2>
            <table>
                <thead>
                <tr>
                    <th>Unique Code</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Volume</th>
                    <th>Notes</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {tares.map((tare) => (
                    <tr key={tare.id}>
                        <td>{tare.unique_code}</td>
                        <td>{tare.name}</td>
                        <td>{tare.type}</td>
                        <td>{tare.volume}L</td>
                        <td>{tare.notes}</td>
                        <td>{tare.is_empty ? 'Empty' : 'Filled'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TareTableContainer;