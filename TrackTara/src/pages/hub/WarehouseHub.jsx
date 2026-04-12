import { Link } from "react-router-dom";
import { Card, Col, Row, Badge } from "react-bootstrap";
import {
  ClipboardList,
  Package,
  Container,
  LayoutGrid,
  LayoutDashboard,
  Truck,
  FilePlus,
  Users,
  Tags,
  Layers,
  ScrollText,
  PackageX,
  Warehouse,
} from "lucide-react";
import useAppRoles from "../../hooks/useAppRoles";

const iconProps = { size: 28, strokeWidth: 1.6 };

function HubCard({ to, title, description, icon: Icon, badge }) {
  return (
    <Col xs={12} sm={6} xl={4}>
      <Link to={to} className="text-decoration-none hub-card-link">
        <Card className="h-100 hub-card shadow-sm border-0">
          <Card.Body className="d-flex gap-3 align-items-start">
            <div className="hub-card-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0">
              <Icon {...iconProps} className="text-primary" />
            </div>
            <div className="min-w-0">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Card.Title as="h2" className="h5 mb-1 text-dark">
                  {title}
                </Card.Title>
                {badge ? (
                  <Badge bg="secondary" className="fw-normal">
                    {badge}
                  </Badge>
                ) : null}
              </div>
              <Card.Text className="small text-muted mb-0">{description}</Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}

/**
 * Стартова панель складу: оберіть поточну роботу замість одразу екрану видавки.
 */
export default function WarehouseHub() {
  const roles = useAppRoles();
  const isAdmin = roles.includes("Administrator");
  const isOp = roles.includes("Operator") || isAdmin;
  const isSales = roles.includes("SalesManager") || isAdmin;

  return (
    <div className="warehouse-hub py-2 py-md-3">
      <div className="mb-4">
        <h1 className="h3 mb-1">Робоча панель</h1>
        <p className="text-muted mb-0">
          Оберіть завдання. Видача замовлень по сектору — у розділі «Збір».
        </p>
      </div>

      {isOp && (
        <section className="mb-4">
          <h2 className="h6 text-uppercase text-muted mb-3 letter-spacing-1">Склад</h2>
          <Row className="g-3">
            <HubCard
              to="/warehouse/pick"
              title="Збір / видача"
              description="Сектор, візки, комплектація замовлень"
              icon={ClipboardList}
            />
            <HubCard
              to="/packing"
              title="Пакування в коробки"
              description="Коробки після видавки: код та етикетка для клієнта"
              icon={Package}
              badge="Після збору"
            />
            <HubCard
              to="/tare"
              title="Контейнери"
              description="Облік тари, прив’язка до товару"
              icon={Container}
            />
            <HubCard
              to="/products"
              title="Товари (SKU)"
              description="Каталог, коди, перегляд"
              icon={LayoutGrid}
            />
          </Row>
        </section>
      )}

      {isSales && (
        <section className="mb-4">
          <h2 className="h6 text-uppercase text-muted mb-3 letter-spacing-1">Продажі</h2>
          <Row className="g-3">
            <HubCard
              to="/sales"
              title="Панель продажів"
              description="Огляд та задачі відділу"
              icon={LayoutDashboard}
            />
            <HubCard
              to="/sales/clients"
              title="Клієнти та траси"
              description="Маршрути й лінії пакування"
              icon={Truck}
            />
            <HubCard
              to="/orders/create"
              title="Нове замовлення"
              description="Оформлення відвантаження"
              icon={FilePlus}
            />
            {!isOp && (
              <HubCard
                to="/products"
                title="Каталог товарів"
                description="Перегляд номенклатури"
                icon={LayoutGrid}
              />
            )}
          </Row>
        </section>
      )}

      {isAdmin && (
        <section className="mb-2">
          <h2 className="h6 text-uppercase text-muted mb-3 letter-spacing-1">Адміністрування</h2>
          <Row className="g-3">
            <HubCard
              to="/users"
              title="Користувачі"
              description="Ролі та скидання паролів"
              icon={Users}
            />
            <HubCard
              to="/productType"
              title="Типи продуктів"
              description="Довідник"
              icon={Tags}
            />
            <HubCard
              to="/container/containerTypes"
              title="Типи контейнерів"
              description="Довідник"
              icon={Layers}
            />
            <HubCard
              to="/carts/registry"
              title="Реєстр візків"
              description="Облік візків"
              icon={ScrollText}
            />
            <HubCard
              to="/brakimag"
              title="Бракімаг"
              description="Некондиція та списання"
              icon={PackageX}
            />
            <HubCard
              to="/packing"
              title="Лінія пакування"
              description="Коробки та візки"
              icon={Warehouse}
            />
          </Row>
        </section>
      )}
    </div>
  );
}
