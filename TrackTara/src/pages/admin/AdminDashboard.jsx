import React, { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Card, Col, Container, ProgressBar, Row, Spinner, Table } from "react-bootstrap";
import {
  UserService,
  ProductService,
  getAllContainers,
  OrderService,
  getAllPackingBoxes,
  getAllBrakiMagItems,
} from "../../utils/services";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { formatWeightKg } from "../../utils/helpers/productWeight";
import { buildRouteWorkloadTable } from "../../utils/stats/routeWorkload";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
);

const fmtDateKey = (iso) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return null;
  }
};

const lastNDays = (n) => {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    days.push(`${y}-${m}-${day}`);
  }
  return days;
};

function StatCard({ title, value, subtitle, badge, variant = "primary" }) {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div className="min-w-0">
            <div className="text-muted small">{title}</div>
            <div className="display-6 lh-1 mt-1">{value}</div>
            {subtitle ? <div className="text-muted small mt-2">{subtitle}</div> : null}
          </div>
          {badge ? (
            <Badge bg={variant} className="align-self-start fw-normal">
              {badge}
            </Badge>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    users: [],
    products: [],
    containers: [],
    orders: [],
    boxes: [],
    braki: [],
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [users, products, containers, orders, boxes, braki] = await Promise.all([
          UserService.getUsers(),
          ProductService.getAll(),
          getAllContainers(),
          OrderService.getAllOrders(),
          getAllPackingBoxes(),
          getAllBrakiMagItems(),
        ]);

        if (!alive) return;
        setData({
          users: Array.isArray(users) ? users : [],
          products: Array.isArray(products) ? products : [],
          containers: Array.isArray(containers) ? containers : [],
          orders: Array.isArray(orders) ? orders : [],
          boxes: Array.isArray(boxes) ? boxes : [],
          braki: Array.isArray(braki) ? braki : [],
        });
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || e?.response?.data || e?.message || "Помилка завантаження статистики");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const computed = useMemo(() => {
    const users = data.users || [];
    const products = data.products || [];
    const containers = data.containers || [];
    const orders = data.orders || [];
    const boxes = data.boxes || [];
    const braki = Array.isArray(data.braki) ? data.braki : [];

    const rolesCount = new Map();
    for (const u of users) {
      const roles = Array.isArray(u.role) ? u.role : [];
      for (const r of roles) rolesCount.set(r, (rolesCount.get(r) || 0) + 1);
    }

    const productTypes = new Map();
    for (const p of products) {
      const k = String(p.typeName || "Без типу");
      productTypes.set(k, (productTypes.get(k) || 0) + 1);
    }

    const containersEmpty = containers.filter((c) => c?.isEmpty === true).length;
    const containersWithProduct = containers.filter((c) => c?.isEmpty === false).length;

    const orderStatus = new Map();
    const itemStatus = new Map();
    let totalItems = 0;
    for (const o of orders) {
      const st = String(o?.status || "unknown");
      orderStatus.set(st, (orderStatus.get(st) || 0) + 1);
      const items = Array.isArray(o?.items) ? o.items : [];
      for (const it of items) {
        totalItems += 1;
        const ist = String(it?.status || "unknown");
        itemStatus.set(ist, (itemStatus.get(ist) || 0) + 1);
      }
    }

    const days = lastNDays(7);
    const boxesByDay = new Map(days.map((d) => [d, 0]));
    for (const b of boxes) {
      const key = fmtDateKey(b?.createdAt);
      if (!key || !boxesByDay.has(key)) continue;
      boxesByDay.set(key, (boxesByDay.get(key) || 0) + 1);
    }

    const brakiByReason = new Map();
    let brakiTotal = 0;
    for (const x of braki) {
      brakiTotal += 1;
      const r = String(x?.reason || "Інше");
      brakiByReason.set(r, (brakiByReason.get(r) || 0) + 1);
    }

    const routeWorkload = buildRouteWorkloadTable(orders, boxes);

    return {
      usersCount: users.length,
      rolesCount,
      productsCount: products.length,
      productTypes,
      containersCount: containers.length,
      containersEmpty,
      containersWithProduct,
      ordersCount: orders.length,
      orderStatus,
      totalItems,
      itemStatus,
      boxesCount: boxes.length,
      boxesByDay,
      brakiTotal,
      brakiByReason,
      routeWorkload,
    };
  }, [data]);

  const rolesChart = useMemo(() => {
    const labels = Array.from(computed.rolesCount.keys());
    const values = labels.map((l) => computed.rolesCount.get(l) || 0);
    return {
      data: {
        labels,
        datasets: [
          {
            label: "Користувачі",
            data: values,
            backgroundColor: ["#0d6efd", "#198754", "#6f42c1", "#fd7e14", "#6c757d"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: { legend: { position: "bottom" } },
        maintainAspectRatio: false,
      },
    };
  }, [computed.rolesCount]);

  const ordersChart = useMemo(() => {
    const labels = Array.from(computed.orderStatus.keys());
    const values = labels.map((l) => computed.orderStatus.get(l) || 0);
    return {
      data: {
        labels,
        datasets: [
          {
            label: "Замовлення",
            data: values,
            backgroundColor: "#0d6efd",
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    };
  }, [computed.orderStatus]);

  const routeLoadChart = useMemo(() => {
    const rows = computed.routeWorkload || [];
    const labels = rows.map((r) => (r.routeCode === "—" ? "Без траси" : r.routeCode));
    const pending = rows.map((r) => r.pendingLines);
    const done = rows.map((r) => r.itemsDone);
    return {
      data: {
        labels,
        datasets: [
          {
            label: "У роботі (позиції)",
            data: pending,
            backgroundColor: "rgba(253, 126, 20, 0.85)",
            stack: "a",
          },
          {
            label: "Зібрано (позиції)",
            data: done,
            backgroundColor: "rgba(25, 135, 84, 0.75)",
            stack: "a",
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { position: "bottom" } },
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
          y: { stacked: true },
        },
      },
    };
  }, [computed.routeWorkload]);

  const boxesChart = useMemo(() => {
    const labels = Array.from(computed.boxesByDay.keys());
    const values = labels.map((d) => computed.boxesByDay.get(d) || 0);
    return {
      data: {
        labels,
        datasets: [
          {
            label: "Коробки/день",
            data: values,
            borderColor: "#198754",
            backgroundColor: "rgba(25, 135, 84, 0.15)",
            fill: true,
            tension: 0.25,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    };
  }, [computed.boxesByDay]);

  return (
    <Container className="mt-4">
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="mb-1">Адмін-дашборд</h1>
          <div className="text-muted">Загальна статистика по системі: користувачі, товари, тара, замовлення, пакування, нестачі.</div>
        </div>
      </div>

      {error ? (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <div className="mt-4 d-flex align-items-center gap-2 text-muted">
          <Spinner size="sm" /> Завантаження статистики…
        </div>
      ) : null}

      <Row className="g-3 mt-3">
        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                <div>
                  <Card.Title className="h6 mb-1">Завантаженість трас</Card.Title>
                  <Card.Subtitle className="text-muted small mb-0">
                    Активні замовлення: скільки позицій і візків у роботі по кожній трасі — щоб оцінити, чи варто підсилити лінію.
                  </Card.Subtitle>
                </div>
              </div>
              {computed.routeWorkload.length === 0 ? (
                <p className="text-muted small mb-0">Немає активних замовлень з розбивкою по трасі.</p>
              ) : (
                <Row className="g-3">
                  <Col lg={5}>
                    <div style={{ height: Math.max(220, computed.routeWorkload.length * 48) }}>
                      <Bar data={routeLoadChart.data} options={routeLoadChart.options} />
                    </div>
                  </Col>
                  <Col lg={7}>
                    <div className="table-responsive">
                      <Table size="sm" hover className="mb-0 align-middle">
                        <thead className="text-muted small">
                          <tr>
                            <th>Траса</th>
                            <th className="text-end">Замовл.</th>
                            <th className="text-end">Позиції</th>
                            <th className="text-end">Візки</th>
                            <th className="text-end">Тара</th>
                            <th className="text-end">Коробки</th>
                            <th className="text-end">Залишок ваги</th>
                            <th style={{ minWidth: 120 }}>Готовність</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {computed.routeWorkload.map((r) => (
                            <tr key={r.routeCode}>
                              <td>
                                <strong>{r.routeCode === "—" ? "Без траси" : r.routeCode}</strong>
                              </td>
                              <td className="text-end">{r.orders}</td>
                              <td className="text-end text-nowrap small">
                                <span className="text-success">{r.itemsDone}</span>
                                <span className="text-muted"> / </span>
                                <span>{r.itemsTotal}</span>
                                {r.pendingLines > 0 ? (
                                  <Badge bg="warning" text="dark" className="ms-1 fw-normal">
                                    у роботі {r.pendingLines}
                                  </Badge>
                                ) : null}
                              </td>
                              <td className="text-end">{r.cartsActive}</td>
                              <td className="text-end">{r.uniqueContainers}</td>
                              <td className="text-end">{r.packingBoxes}</td>
                              <td className="text-end small text-nowrap">{formatWeightKg(r.remainingWeightKg)}</td>
                              <td>
                                <ProgressBar
                                  now={r.progressPct}
                                  label={`${r.progressPct}%`}
                                  variant={r.progressPct >= 100 ? "success" : r.progressPct >= 50 ? "info" : "warning"}
                                  style={{ minHeight: 22 }}
                                />
                              </td>
                              <td className="text-end">
                                {r.needHelp ? (
                                  <Badge bg="danger" className="fw-normal">
                                    Підсилити
                                  </Badge>
                                ) : (
                                  <Badge bg="light" text="dark" className="fw-normal border">
                                    Норма
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col md={6} xl={3}>
          <StatCard title="Користувачі" value={computed.usersCount} subtitle="Всього у системі" badge="RBAC" />
        </Col>
        <Col md={6} xl={3}>
          <StatCard title="Товари (SKU)" value={computed.productsCount} subtitle="Номенклатура" badge="Каталог" variant="success" />
        </Col>
        <Col md={6} xl={3}>
          <StatCard
            title="Контейнери"
            value={computed.containersCount}
            subtitle={`Порожніх: ${computed.containersEmpty} • З товаром: ${computed.containersWithProduct}`}
            badge="Тара"
            variant="warning"
          />
        </Col>
        <Col md={6} xl={3}>
          <StatCard title="Замовлення" value={computed.ordersCount} subtitle={`Позицій (items): ${computed.totalItems}`} badge="Операції" variant="info" />
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="h6 mb-3">Ролі користувачів</Card.Title>
              <div style={{ height: 260 }}>
                {rolesChart.data.labels.length ? <Doughnut data={rolesChart.data} options={rolesChart.options} /> : <div className="text-muted small">Немає даних</div>}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="h6 mb-3">Статуси замовлень</Card.Title>
              <div style={{ height: 260 }}>
                {ordersChart.data.labels.length ? <Bar data={ordersChart.data} options={ordersChart.options} /> : <div className="text-muted small">Немає даних</div>}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="h6 mb-3">Пакування (7 днів)</Card.Title>
              <div style={{ height: 260 }}>
                <Line data={boxesChart.data} options={boxesChart.options} />
              </div>
              <div className="text-muted small mt-2">
                Всього коробок: <strong>{computed.boxesCount}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col lg={8}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="h6 mb-3">Товари за типами</Card.Title>
              <div className="d-flex flex-wrap gap-2">
                {Array.from(computed.productTypes.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 12)
                  .map(([k, v]) => (
                    <Badge key={k} bg="secondary" className="fw-normal">
                      {k}: <strong>{v}</strong>
                    </Badge>
                  ))}
                {computed.productTypes.size === 0 ? <div className="text-muted small">Немає даних</div> : null}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="h6 mb-2">Нестачі (бракімаг)</Card.Title>
              <div className="display-6 lh-1">{computed.brakiTotal}</div>
              <div className="text-muted small mt-2">Записів у реєстрі</div>
              <div className="mt-3 d-flex flex-column gap-1">
                {Array.from(computed.brakiByReason.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([k, v]) => (
                    <div key={k} className="d-flex justify-content-between gap-2 small">
                      <span className="text-muted">{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

