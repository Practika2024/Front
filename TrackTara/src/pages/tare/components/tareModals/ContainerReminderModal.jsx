import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
                        <DatePicker
                            selected={dueDate ? new Date(dueDate) : null}
                            onChange={(date) => setForm({ ...form, dueDate: date.toISOString() })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="Pp"
                            placeholderText="Оберіть дату і час"
                            className="form-control"
                            popperPlacement="bottom-start"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Тип</Form.Label>
                        <Form.Select
                            value={type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="">Оберіть тип</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
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
