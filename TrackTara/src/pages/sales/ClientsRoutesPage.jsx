import { useEffect, useState } from "react";
import { Container, Col, Card, Table, Form, Button, Tabs, Tab } from "react-bootstrap";
import { ClientRouteService } from "../../utils/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ClientsRoutesPage.css";

const ClientsRoutesPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newClientName, setNewClientName] = useState("");
  const [newClientRoute, setNewClientRoute] = useState("");

  const [newRouteCode, setNewRouteCode] = useState("");
  const [newPackingLine, setNewPackingLine] = useState("");
  const [newTables, setNewTables] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [c, r] = await Promise.all([
        ClientRouteService.getClients(),
        ClientRouteService.getRouteMasters(),
      ]);
      setClients(c);
      setRoutes(r);
    } catch (e) {
      console.error(e);
      toast.error("Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await ClientRouteService.createClient({
        name: newClientName,
        routeCode: newClientRoute,
      });
      toast.success("Клієнта додано");
      setNewClientName("");
      setNewClientRoute("");
      load();
    } catch (err) {
      toast.error(err.response?.data || err.message || "Помилка");
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm("Видалити клієнта?")) return;
    try {
      await ClientRouteService.deleteClient(id);
      toast.success("Видалено");
      load();
    } catch (err) {
      toast.error(err.response?.data || "Помилка");
    }
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    const tables = newTables.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      await ClientRouteService.createRouteMaster({
        routeCode: newRouteCode,
        packingLineCode: newPackingLine,
        packingTableCodes: tables,
      });
      toast.success("Трасу додано");
      setNewRouteCode("");
      setNewPackingLine("");
      setNewTables("");
      load();
    } catch (err) {
      toast.error(err.response?.data || err.message || "Помилка");
    }
  };

  const handleDeleteRoute = async (routeCode) => {
    if (!window.confirm(`Видалити трасу ${routeCode}?`)) return;
    try {
      await ClientRouteService.deleteRouteMaster(routeCode);
      toast.success("Видалено");
      load();
    } catch (err) {
      toast.error(err.response?.data || "Помилка");
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" onClick={() => navigate("/sales")}>
          ← Назад
        </Button>
      </div>
      <h1 className="mb-3">Клієнти та траси</h1>
      {loading ? (
        <p>Завантаження…</p>
      ) : (
        <Tabs defaultActiveKey="routes" className="mb-3 clients-routes-tabs">
          <Tab eventKey="routes" title="Траси → лінія пакування">
            <Card className="mt-3">
              <Card.Body>
                <p className="text-muted small">
                  Спочатку додайте траси. Кожна траса має одну лінію пакування та хоча б один стіл (куди
                  автоматично направляється візок після першого товару).
                </p>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Траса</th>
                      <th>Лінія пакування</th>
                      <th>Столи</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r) => (
                      <tr key={r.routeCode}>
                        <td>
                          <strong>{r.routeCode}</strong>
                        </td>
                        <td>{r.packingLineCode}</td>
                        <td>{(r.packingTableCodes || []).join(", ")}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteRoute(r.routeCode)}
                          >
                            Видалити
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
                <Form onSubmit={handleCreateRoute} className="row g-2 align-items-end">
                  <Col md={2}>
                    <Form.Label>Траса</Form.Label>
                    <Form.Control
                      value={newRouteCode}
                      onChange={(e) => setNewRouteCode(e.target.value.toUpperCase())}
                      placeholder="AC"
                      maxLength={6}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Лінія пакування</Form.Label>
                    <Form.Control
                      value={newPackingLine}
                      onChange={(e) => setNewPackingLine(e.target.value)}
                      placeholder="PACK-LINE-…"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Столи (через кому)</Form.Label>
                    <Form.Control
                      value={newTables}
                      onChange={(e) => setNewTables(e.target.value)}
                      placeholder="ST-AC-1, ST-AC-2"
                    />
                  </Col>
                  <Col md={2}>
                    <Button type="submit" variant="primary" className="w-100">
                      Додати
                    </Button>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="clients" title="Клієнти">
            <Card className="mt-3">
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Клієнт</th>
                      <th>Траса</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>
                          <BadgeRoute routeCode={c.routeCode} routes={routes} />
                        </td>
                        <td>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClient(c.id)}>
                            Видалити
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
                <Form onSubmit={handleCreateClient} className="row g-2 align-items-end">
                  <Col md={6}>
                    <Form.Label>Назва клієнта</Form.Label>
                    <Form.Control
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Траса (з довідника)</Form.Label>
                    <Form.Select
                      value={newClientRoute}
                      onChange={(e) => setNewClientRoute(e.target.value)}
                      required
                    >
                      <option value="">Оберіть</option>
                      {routes.map((r) => (
                        <option key={r.routeCode} value={r.routeCode}>
                          {r.routeCode} — {r.packingLineCode}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button type="submit" variant="success" className="w-100">
                      Додати
                    </Button>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

function BadgeRoute({ routeCode, routes }) {
  const r = routes.find((x) => x.routeCode === routeCode);
  if (!r) return <span>{routeCode}</span>;
  return (
    <span title={r.packingLineCode}>
      <strong>{routeCode}</strong>
      <small className="text-muted ms-1">({r.packingLineCode})</small>
    </span>
  );
}

export default ClientsRoutesPage;
