import React, { useState } from 'react';
import containerTypes from '../../../constants/containerTypes'; // Adjust the path as needed
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const TareFilterForm = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [minVolume, setMinVolume] = useState(0);
    const [maxVolume, setMaxVolume] = useState(1000);
    const [type, setType] = useState([]);
    const [isEmpty, setIsEmpty] = useState(null);

    const handleTypeChange = (selectedType) => {
        setType((prevType) =>
            prevType.includes(selectedType)
                ? prevType.filter((t) => t !== selectedType)
                : [...prevType, selectedType]
        );
    };

    const handleStatusChange = (status) => {
        setIsEmpty((prevStatus) => (prevStatus === status ? null : status));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ name, minVolume, maxVolume, type, isEmpty });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
                <label className="form-label">Ім&#39;я</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Об&#39;єм(л)</label>
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
                <div className="d-flex justify-content-between mt-2">
                    <input
                        type="number"
                        className="form-control"
                        value={minVolume}
                        onChange={(e) => setMinVolume(Number(e.target.value))}
                    />
                    <input
                        type="number"
                        className="form-control"
                        value={maxVolume}
                        onChange={(e) => setMaxVolume(Number(e.target.value))}
                    />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Тип</label>
                <div className="d-flex flex-wrap">
                    {containerTypes.map((containerType) => (
                        <button
                            type="button"
                            key={containerType.id}
                            className={`btn btn-outline-primary m-1 ${type.includes(containerType.id) ? 'active' : ''}`}
                            onClick={() => handleTypeChange(containerType.id)}
                        >
                            {containerType.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Статус</label>
                <div className="d-flex">
                    <button
                        type="button"
                        className={`btn btn-outline-primary m-1 ${isEmpty === true ? 'active' : ''}`}
                        onClick={() => handleStatusChange(true)}
                    >
                        Порожній
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary m-1 ${isEmpty === false ? 'active' : ''}`}
                        onClick={() => handleStatusChange(false)}
                    >
                        Заповнений
                    </button>
                </div>
            </div>
            <button type="submit" className="btn btn-primary">Фільтрувати</button>
        </form>
    );
};

export default TareFilterForm;