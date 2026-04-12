import { Link } from "react-router-dom";
import { Card, Row, Col, Container } from "react-bootstrap";

const SalesDashboard = () => {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Продажі та замовлення</h1>
      <p className="text-muted mb-4">
        Клієнт прив&apos;язаний до <strong>траси</strong> (код маршруту). До траси налаштовується{" "}
        <strong>лінія пакування</strong> і <strong>столи</strong>. Після першого товару у візку
        автоматично фіксуються траса замовлення та стіл на лінії.
      </p>
      <Row className="g-3">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Клієнти та траси</Card.Title>
              <Card.Text>Довідник клієнтів і маршрутів (AC, HR, HC…), ліній пакування.</Card.Text>
              <Link className="btn btn-primary" to="/sales/clients">
                Відкрити
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Нове замовлення</Card.Title>
              <Card.Text>Оберіть клієнта — підставляться траса та лінія пакування.</Card.Text>
              <Link className="btn btn-success" to="/orders/create">
                Створити замовлення
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SalesDashboard;
