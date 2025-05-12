import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDeleteModal = ({ show, onClose, onConfirm }) => (
    <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Підтвердження видалення</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ви впевнені, що хочете видалити контейнер?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>Ні</Button>
            <Button variant="danger" onClick={onConfirm}>Так</Button>
        </Modal.Footer>
    </Modal>
);

export default ConfirmDeleteModal;
