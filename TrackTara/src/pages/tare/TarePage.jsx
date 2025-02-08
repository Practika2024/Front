// src/pages/tare/TarePage.jsx
import React from 'react';
import TareTableContainer from './components/TareTableContainer';

const TarePage = () => {
    return (
        <div className="container my-3">
            <h1>Tare Management</h1>
            <TareTableContainer />
        </div>
    );
};

export default TarePage;