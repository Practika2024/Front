import React, { useState, useEffect } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getAllContainerTypes } from '../../../utils/services/ContainerTypesService';

const ContainerFilterForm = ({ onFilter }) => {
    const [containerTypes, setContainerTypes] = useState([]);
    const [uniqueCode, setUniqueCode] = useState('');
    const [name, setName] = useState('');
    const [minVolume, setMinVolume] = useState(0);
    const [maxVolume, setMaxVolume] = useState(1000);
    const [selectedTypes, setSelectedTypes] = useState([]); // масив id вибраних типів
    const [isEmpty, setIsEmpty] = useState(null);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const types = await getAllContainerTypes();
                setContainerTypes(types);
            } catch (error) {
                console.error('Error fetching container types:', error);
            }
        };
        fetchTypes();
    }, []);

    useEffect(() => {
        console.log('Fetched container types:', containerTypes);
    }, [containerTypes]);

    const handleTypeChange = (id) => {
        // Якщо тип уже вибраний, видаляємо його із списку
        if (selectedTypes.includes(String(id))) {
            setSelectedTypes(selectedTypes.filter(typeId => typeId !== String(id)));
        } else {
            setSelectedTypes([...selectedTypes, String(id)]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ uniqueCode, name, minVolume, maxVolume, type: selectedTypes, isEmpty });
    };

    const handleReset = () => {
        setUniqueCode('');
        setName('');
        setMinVolume(0);
        setMaxVolume(1000);
        setSelectedTypes([]);
        setIsEmpty(null);
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3 border rounded">
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="За унікальним кодом"
                    value={uniqueCode}
                    onChange={(e) => setUniqueCode(e.target.value)}
                />
            </Form.Group>
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
                <Form.Label>Тип контейнера</Form.Label>
                <div>
                    {containerTypes.map((containerType) => (
                        <Form.Check
                            key={containerType.id}
                            type="checkbox"
                            id={`container-type-${containerType.id}`}
                            label={containerType.name}
                            checked={selectedTypes.includes(String(containerType.id))}
                            onChange={() => handleTypeChange(containerType.id)}
                        />
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
                            onChange={() => setIsEmpty(false)}
                        />
                    </div>
                    <div>
                        <Form.Check
                            type="radio"
                            label="Ні"
                            name="status"
                            checked={isEmpty === true}
                            onChange={() => setIsEmpty(true)}
                        />
                    </div>
                </div>
            </Form.Group>
            <Button type="submit" variant="success" className="w-100 mb-2">
                Застосувати
            </Button>
            <Button variant="outline-secondary" className="w-100" onClick={handleReset}>
                Скинути фільтри
            </Button>
        </Form>
    );
};

ContainerFilterForm.propTypes = {
    onFilter: PropTypes.func.isRequired,
};

export default ContainerFilterForm;
