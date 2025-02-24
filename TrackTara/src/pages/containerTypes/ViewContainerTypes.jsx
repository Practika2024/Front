import React, { useState, useEffect } from 'react';
import {
    getAllContainerTypes,
    deleteContainerType,
    createContainerType,
} from '../../utils/services/ContainerTypesService.js';
import { Button, Modal, Form } from 'react-bootstrap';

const ViewContainerTypes = () => {
    const [containerTypes, setContainerTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    useEffect(() => {
        const fetchContainerTypes = async () => {
            try {
                const types = await getAllContainerTypes();
                setContainerTypes(types);
            } catch (error) {
                console.error('Error fetching container types:', error);
            }
        };

        fetchContainerTypes();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteContainerType(id);
            setContainerTypes(containerTypes.filter((type) => type.id !== id));
        } catch (error) {
            console.error('Error deleting container type:', error);
        }
    };

    const handleCreateType = async () => {
        try {
            const newType = await createContainerType({ name: newTypeName });
            if (newType && newType.id) {
                setContainerTypes([...containerTypes, newType]);
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error creating container type:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Container Types</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Add New Container Type
            </Button>
            <table className="table table-striped mt-3">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {containerTypes.map((type) => (
                    <tr key={type.id}>
                        <td>{type.name}</td>
                        <td>
                            <Button
                                variant="link"
                                onClick={() => handleDelete(type.id)}
                                className="p-0 border-4"
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
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Container Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewTypeName">
                            <Form.Label>New Type Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateType}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ViewContainerTypes;
