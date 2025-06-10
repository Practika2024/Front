import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { ReminderTypeService } from "../../../../utils/services/ReminderTypeService";

const darkInputStyle = {
    backgroundColor: '#23242a',
    color: '#fff',
    border: '1px solid #444',
};
const darkLabelStyle = {
    color: '#fff',
    fontWeight: 500,
};
const darkPlaceholderStyle = {
    color: '#aaa',
};

const ContainerReminderModal = ({ show, onHide, form = {}, setForm, onSubmit }) => {
    const { title = "", dueDate = "", type = "" } = form;
    const [reminderTypes, setReminderTypes] = useState([]);

    useEffect(() => {
        if (show) {
            ReminderTypeService.getAll().then((data) => {
                let types = [];
                if (Array.isArray(data)) {
                    types = data;
                } else if (data?.items && Array.isArray(data.items)) {
                    types = data.items;
                } else if (data?.payload && Array.isArray(data.payload)) {
                    types = data.payload;
                } else if (data?.payload?.items && Array.isArray(data.payload.items)) {
                    types = data.payload.items;
                }
                setReminderTypes(types);
            });
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onHide} contentClassName="bg-dark text-light">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Створити нагадування</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label style={darkLabelStyle}>Назва</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            style={darkInputStyle}
                            placeholder="Введіть назву"
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={darkLabelStyle} className="d-block">Дата</Form.Label>
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
                            style={darkInputStyle}
                            calendarClassName="dark-datepicker"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={darkLabelStyle}>Тип</Form.Label>
                        <Form.Select
                            value={type}
                            style={darkInputStyle}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="" style={darkPlaceholderStyle}>Оберіть тип</option>
                            {reminderTypes.map((remType) => (
                                <option key={remType.id} value={remType.id}>{remType.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} style={{ background: '#444', border: 'none', color: '#fff' }}>Скасувати</Button>
                <Button variant="warning" onClick={onSubmit} style={{ color: '#23242a', fontWeight: 600 }}>Зберегти</Button>
            </Modal.Footer>
            <style>{`
                .bg-dark {
                    background: #23242a !important;
                }
                .text-light {
                    color: #fff !important;
                }
                .form-control, .form-select {
                    background: #23242a !important;
                    color: #fff !important;
                    border: 1px solid #444 !important;
                }
                .form-control::placeholder {
                    color: #aaa !important;
                }
                .dark-datepicker {
                    background: #23242a !important;
                    color: #fff !important;
                    border: 1px solid #444 !important;
                }
                .react-datepicker__input-container input {
                    background: #23242a !important;
                    color: #fff !important;
                    border: 1px solid #444 !important;
                }
                .react-datepicker__header {
                    background: #23242a !important;
                    border-bottom: 1px solid #444 !important;
                }
                .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
                    color: #fff !important;
                }
                .react-datepicker__day, .react-datepicker__day-name {
                    color: #fff !important;
                }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
                    background: #ffc107 !important;
                    color: #23242a !important;
                }
                .react-datepicker__time-container,
                .react-datepicker__time,
                .react-datepicker__time-box {
                    background: #23242a !important;
                    color: #fff !important;
                }
                .react-datepicker__time-list-item {
                    background: #23242a !important;
                    color: #fff !important;
                }
                .react-datepicker__time-list-item--selected,
                .react-datepicker__time-list-item--keyboard-selected {
                    background: #ffc107 !important;
                    color: #23242a !important;
                }
            `}</style>
        </Modal>
    );
};

export default ContainerReminderModal;
