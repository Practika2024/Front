import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import useActions from "../../../../hooks/useActions";
import { toast } from "react-toastify";

const AdminResetPasswordModal = ({ show, onHide, userId, userEmail }) => {
  const { adminResetPassword } = useActions();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setPassword("");
    setConfirm("");
    setError("");
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Пароль — щонайменше 6 символів");
      return;
    }
    if (password !== confirm) {
      setError("Паролі не збігаються");
      return;
    }
    setSaving(true);
    const result = await adminResetPassword(userId, password);
    setSaving(false);
    if (result.success) {
      toast.success(result.message || "Пароль оновлено");
      handleClose();
    } else {
      setError(result.message || "Помилка");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Новий пароль для працівника</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="small text-muted mb-2">
            {userEmail ? <>Обліковий запис: <strong>{userEmail}</strong></> : null}
          </p>
          <p className="small text-muted">
            Працівник зможе одразу увійти з новим паролем. Повідомте йому пароль безпечним каналом.
          </p>
          {error ? <Alert variant="danger py-2">{error}</Alert> : null}
          <Form.Group className="mb-2">
            <Form.Label>Новий пароль</Form.Label>
            <Form.Control
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </Form.Group>
          <Form.Group className="mb-0">
            <Form.Label>Повторити пароль</Form.Label>
            <Form.Control
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={handleClose} disabled={saving}>
            Скасувати
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Збереження…" : "Зберегти"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

AdminResetPasswordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  userEmail: PropTypes.string,
};

export default AdminResetPasswordModal;
