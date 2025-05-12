import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmClearProductModal = ({ show, onClose, onConfirm }) => (
    <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Підтвердження очищення</Modal.Title>
        </Modal.Header>
        <Modal.Body>Очистити продукт з контейнера?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>Ні</Button>
            <Button variant="danger" onClick={onConfirm}>Так</Button>
        </Modal.Footer>
    </Modal>
);

export default ConfirmClearProductModal;
