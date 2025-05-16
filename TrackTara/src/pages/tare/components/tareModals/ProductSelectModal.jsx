import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";

const ProductSelectModal = ({
                                show,
                                onClose,
                                onConfirm,
                                products,
                                setSelectedProductId,
                            }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Виберіть продукт</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    options={products.map((p) => ({ value: p.id, label: p.name }))}
                    onChange={(opt) => setSelectedProductId(opt?.value)}
                    placeholder="Пошук за назвою"
                    isClearable
                    classNamePrefix="select"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Підтвердити
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductSelectModal;
