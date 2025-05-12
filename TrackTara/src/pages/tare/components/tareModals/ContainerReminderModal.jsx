import { Modal, Button, Form } from "react-bootstrap";

const ContainerReminderModal = ({ show, onHide, form = {}, setForm, onSubmit }) => {
    const { title = "", dueDate = "", type = "" } = form;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Створити нагадування</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Назва</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Дата</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Тип</Form.Label>
                        <Form.Control
                            type="text"
                            value={type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Скасувати</Button>
                <Button variant="primary" onClick={onSubmit}>Зберегти</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ContainerReminderModal;
