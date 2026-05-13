import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useActions from "../../hooks/useActions";

/**
 * Обліковий запис без робочої роли (Guest): доступ лише до цієї сторінки, доки адміністратор не призначить роль.
 */
const PendingRolePage = () => {
  const { logoutUser } = useActions();
  const navigate = useNavigate();

  /**
   * Гість не має до куди редіректнутись після logout (роль ще порожня),
   * тож робимо explicit navigate('/login') після очищення токенів.
   */
  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "36rem" }}>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4 text-center">
          <Card.Title className="mb-3">Доступ ще не налаштовано</Card.Title>
          <Card.Text className="text-muted mb-4">
            Ваш обліковий запис активний, але робочу роль ще не призначено. Зачекайте, поки адміністратор
            надасть вам права (оператор, менеджер продажів тощо). Після цього вийдіть і увійдіть знову —
            або оновіть сесію, якщо ваш сервер видасть новий токен з ролями.
          </Card.Text>
          <Button variant="outline-secondary" onClick={handleLogout}>
            Вийти з облікового запису
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PendingRolePage;
