import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReminderTypes, createReminderType, updateReminderTypeThunk, deleteReminderTypeThunk } from '../../store/state/actions/reminderTypeActions';
import { useTranslation } from 'react-i18next';

const ReminderTypesPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: reminderTypes, loading, error } = useSelector(state => state.reminderTypes);
    const [newTypeName, setNewTypeName] = useState('');

    useEffect(() => {
        dispatch(fetchReminderTypes());
    }, [dispatch]);

    const handleAddReminderType = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createReminderType({ 
                name: newTypeName
            }));
            setNewTypeName('');
        } catch (error) {
            console.error('Failed to add reminder type:', error);
        }
    };

    const handleUpdateReminderType = async (id, reminderType) => {
        try {
            await dispatch(updateReminderTypeThunk({ id, ...reminderType }));
        } catch (error) {
            console.error('Failed to update reminder type:', error);
        }
    };

    const handleDeleteReminderType = async (id) => {
        try {
            await dispatch(deleteReminderTypeThunk(id));
        } catch (error) {
            console.error('Failed to delete reminder type:', error);
        }
    };

    if (loading) return <div className="table-empty-state">{t('common.loading')}</div>;
    if (error) return <div className="table-empty-state text-danger">{t('common.error')}: {error}</div>;

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>{t('reminderTypes.title')}</h2>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">{t('reminderTypes.listTitle')}</Card.Title>

                            {reminderTypes.length === 0 ? (
                                <div className="table-empty-state">{t('reminderTypes.emptyList')}</div>
                            ) : (
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th className="text-start">{t('reminderTypes.name')}</th>
                                            <th className="text-center" style={{ width: '100px' }}>{t('common.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reminderTypes.map((type) => (
                                            <tr key={type.id}>
                                                <td className="text-start">{type.name}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="table-action-btn"
                                                        title={t('common.delete')}
                                                        onClick={() => handleDeleteReminderType(type.id)}
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
                            <Card.Title className="mb-3">{t('reminderTypes.addTitle')}</Card.Title>
                            <Form onSubmit={handleAddReminderType}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('reminderTypes.name')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t('reminderTypes.namePlaceholder')}
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                        className="product-type-input"
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" className="w-100">
                                    {t('reminderTypes.addNew')}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ReminderTypesPage; 