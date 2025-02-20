import React, { useState } from 'react';
import containerTypes from '../../../constants/containerTypes';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ContainerFilterForm = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [minVolume, setMinVolume] = useState(0);
    const [maxVolume, setMaxVolume] = useState(1000);
    const [type, setType] = useState([]);
    const [isEmpty, setIsEmpty] = useState(null);

    const handleTypeChange = (selectedType) => {
        setType(prevType =>
            prevType.includes(selectedType)
                ? prevType.filter(t => t !== selectedType)
                : [...prevType, selectedType]
        );
    };

    const handleStatusChange = (status) => {
        setIsEmpty(prevStatus => (prevStatus === status ? null : status));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ name, minVolume, maxVolume, type, isEmpty });
    };

    const handleReset = () => {
        setName('');
        setMinVolume(0);
        setMaxVolume(1000);
        setType([]);
        setIsEmpty(null);
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3 border rounded">
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Пошук за назвою"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Об'єм (л)</Form.Label>
                <Slider
                    range
                    min={0}
                    max={1000}
                    value={[minVolume, maxVolume]}
                    onChange={([min, max]) => {
                        setMinVolume(min);
                        setMaxVolume(max);
                    }}
                />
                <Row className="mt-2">
                    <Col>
                        <Form.Control
                            type="number"
                            value={minVolume}
                            onChange={(e) => setMinVolume(Number(e.target.value))}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            value={maxVolume}
                            onChange={(e) => setMaxVolume(Number(e.target.value))}
                        />
                    </Col>
                </Row>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Тип</Form.Label>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {containerTypes.map(containerType => (
                        <div key={containerType.id} style={{ marginRight: '15px' }}>
                            <Form.Check
                                type="checkbox"
                                label={containerType.name}
                                checked={type.includes(containerType.id)}
                                onChange={() => handleTypeChange(containerType.id)}
                            />
                        </div>
                    ))}
                </div>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Чи заповнений</Form.Label>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ marginRight: '15px' }}>
                        <Form.Check
                            type="radio"
                            label="Так"
                            name="status"
                            checked={isEmpty === false}
                            onChange={() => handleStatusChange(false)}
                        />
                    </div>
                    <div>
                        <Form.Check
                            type="radio"
                            label="Ні"
                            name="status"
                            checked={isEmpty === true}
                            onChange={() => handleStatusChange(true)}
                        />
                    </div>
                </div>
            </Form.Group>

            <Button type="submit" variant="success" className="w-100 mb-2">Застосувати</Button>
            <Button variant="outline-secondary" className="w-100" onClick={handleReset}>Скинути фільтри</Button>
        </Form>
    );
};

export default ContainerFilterForm;
