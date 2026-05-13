import { useEffect, useMemo, useState, Fragment } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  Modal,
  Form,
  Alert,
  Badge,
  Collapse,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  OrderService,
  ClientRouteService,
  getAllPackingBoxes,
  createPackingBox,
  deletePackingBox,
  addToPackingBox,
  transferPackingBoxContent,
} from "../../utils/services";
import { toast } from "react-toastify";
import { lineTotalWeightKg, formatWeightKg } from "../../utils/helpers/productWeight";

const PACKING_ROUTE_STORAGE_KEY = "tracktara_packing_work_route";

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const normCode = (s) => String(s ?? "").trim().toUpperCase();

/** Пошук позиції в візку за номером візка та кодом тари або товару. */
function findCartLineByScan(orders, cartNumberRaw, productRaw) {
  const cn = normCode(cartNumberRaw);
  const pc = normCode(productRaw);
  if (!cn || !pc) return { error: "Вкажіть номер візка та відскануйте або введіть код товару чи тари." };

  const matches = [];
  for (const order of orders) {
    for (const cart of order.carts || []) {
      if (normCode(cart.cartNumber) !== cn) continue;
      for (const it of cart.items || []) {
        const oi = (order.items || []).find((i) => Number(i.id) === Number(it.itemId));
        if (!oi) continue;
        const byContainer = normCode(it.containerCode) === pc;
        const byProduct = normCode(oi.productCode) === pc;
        if (byContainer || byProduct) {
          matches.push({ order, cart, cartLine: it, orderItem: oi });
        }
      }
    }
  }

  if (matches.length === 0) {
    const hasCart = orders.some((o) =>
      (o.carts || []).some((c) => normCode(c.cartNumber) === cn && (c.items || []).length > 0)
    );
    if (!hasCart) {
      return { error: "Візок з таким номером не знайдено серед видач на візок." };
    }
    return { error: "У цьому візку немає позиції з таким кодом товару чи тари." };
  }
  if (matches.length > 1) {
    return {
      error:
        "Знайдено кілька збігів для цих даних (неоднозначність). Зверніться до адміністратора.",
    };
  }
  return { result: matches[0] };
}

/** Усі непусті візки з цим номером (різні замовлення). */
function findCartsWithItemsByNumber(orders, cartNumberRaw) {
  const cn = normCode(cartNumberRaw);
  if (!cn) return [];
  const out = [];
  for (const order of orders) {
    for (const cart of order.carts || []) {
      if (normCode(cart.cartNumber) !== cn) continue;
      if (!(cart.items || []).length) continue;
      out.push({ order, cart });
    }
  }
  return out;
}

function cartRouteLabel(order, cart) {
  const r = normCode(cart.routeCode || order.routeCode || "");
  return r || null;
}

function shouldWarnOtherRoute(workerRouteRaw, order, cart) {
  const w = normCode(workerRouteRaw);
  if (!w) return false;
  const r = cartRouteLabel(order, cart);
  if (!r) return false;
  return r !== w;
}

/** Повертає true, якщо можна продовжувати. */
function confirmOtherRouteIfNeeded(workerRouteRaw, order, cart) {
  if (!shouldWarnOtherRoute(workerRouteRaw, order, cart)) return true;
  const r = cartRouteLabel(order, cart);
  const w = normCode(workerRouteRaw);
  return window.confirm(
    `Увага: цей візок зібраний під трасу ${r}, а ви вказали, що працюєте на трасі ${w}. ` +
      `Можливо, хтось підставив візок з іншої траси. Ви впевнені, що продовжуєте?`
  );
}

function confirmOtherRouteForCartList(workerRouteRaw, entries) {
  if (!normCode(workerRouteRaw)) return true;
  const odd = entries.filter(({ order, cart }) => shouldWarnOtherRoute(workerRouteRaw, order, cart));
  if (!odd.length) return true;
  const routes = [
    ...new Set(odd.map(({ order, cart }) => cartRouteLabel(order, cart)).filter(Boolean)),
  ];
  const w = normCode(workerRouteRaw);
  return window.confirm(
    `Увага: вміст візка відповідає трасі ${routes.join(", ")}, а у полі «Моя траса» обрано ${w}. ` +
      `Інший працівник міг віднести сюди чужий візок. Впевнені, що дивитесь саме свій?`
  );
}

const PackingStationPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [boxClient, setBoxClient] = useState("");
  const [boxOrderId, setBoxOrderId] = useState(null);
  const [workerNote, setWorkerNote] = useState("");
  const [expandedBoxIds, setExpandedBoxIds] = useState(() => new Set());

  const [showAddModal, setShowAddModal] = useState(false);
  const [addTargetBox, setAddTargetBox] = useState(null);
  const [addCartNumber, setAddCartNumber] = useState("");
  const [addOrderItemId, setAddOrderItemId] = useState("");
  const [addQty, setAddQty] = useState("");

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFromBox, setTransferFromBox] = useState(null);
  const [transferLine, setTransferLine] = useState(null);
  const [transferToBoxId, setTransferToBoxId] = useState("");
  const [transferQty, setTransferQty] = useState("");

  const [scanCartNumber, setScanCartNumber] = useState("");
  const [scanProductCode, setScanProductCode] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const [showReferenceCarts, setShowReferenceCarts] = useState(false);
  const [routeMasters, setRouteMasters] = useState([]);
  const [packingWorkRouteCode, setPackingWorkRouteCode] = useState(() => {
    try {
      return localStorage.getItem(PACKING_ROUTE_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [showCartPreviewModal, setShowCartPreviewModal] = useState(false);
  const [cartPreviewEntries, setCartPreviewEntries] = useState([]);
  const [quickAddBoxId, setQuickAddBoxId] = useState("");
  const [quickAddQty, setQuickAddQty] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [o, b] = await Promise.all([OrderService.getAllOrders(), getAllPackingBoxes()]);
      setOrders(o);
      setBoxes(b);
    } catch (e) {
      console.error(e);
      toast.error("Помилка завантаження");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let cancelled = false;
    ClientRouteService.getRouteMasters()
      .then((rows) => {
        if (!cancelled) setRouteMasters(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (!cancelled) setRouteMasters([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const orderById = (id) => orders.find((o) => Number(o.id) === Number(id)) || null;

  const packedForLine = (orderId, cartNumber, orderItemId) => {
    let sum = 0;
    for (const b of boxes) {
      if (Number(b.orderId) !== Number(orderId)) continue;
      for (const c of b.contents || []) {
        if (
          Number(c.orderItemId) === Number(orderItemId) &&
          String(c.sourceCartNumber) === String(cartNumber)
        ) {
          sum += Number(c.quantity) || 0;
        }
      }
    }
    return sum;
  };

  const cartsWithContext = useMemo(() => {
    const out = [];
    orders.forEach((order) => {
      (order.carts || []).forEach((cart) => {
        if (!cart.items?.length) return;
        out.push({ order, cart });
      });
    });
    return out;
  }, [orders]);

  const boxCountForOrder = (orderId) =>
    boxes.filter((b) => Number(b.orderId) === Number(orderId)).length;

  const boxesForOrder = (orderId) =>
    boxes.filter((b) => Number(b.orderId) === Number(orderId));

  useEffect(() => {
    if (!scanResult) {
      setQuickAddBoxId("");
      setQuickAddQty("");
      return;
    }
    const oid = scanResult.order.id;
    const cartNum = scanResult.cart.cartNumber;
    const itemId = scanResult.orderItem.id;
    const cartQty = Number(scanResult.cartLine.quantity) || 0;
    let packed = 0;
    for (const b of boxes) {
      if (Number(b.orderId) !== Number(oid)) continue;
      for (const c of b.contents || []) {
        if (Number(c.orderItemId) === Number(itemId) && String(c.sourceCartNumber) === String(cartNum)) {
          packed += Number(c.quantity) || 0;
        }
      }
    }
    const rem = Math.max(0, cartQty - packed);
    const list = boxesForOrder(oid);
    setQuickAddBoxId((prev) => {
      if (prev && list.some((b) => String(b.id) === prev)) return prev;
      return list[0] ? String(list[0].id) : "";
    });
    setQuickAddQty(rem > 0 ? String(rem) : "");
  }, [scanResult, boxes]);

  const toggleExpand = (id) => {
    setExpandedBoxIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCreateBox = (orderId, clientName) => {
    setBoxOrderId(orderId);
    setBoxClient(clientName || "");
    setWorkerNote("");
    setShowBoxModal(true);
  };

  const runScanLookup = () => {
    setScanError("");
    setScanResult(null);
    const { result, error } = findCartLineByScan(orders, scanCartNumber, scanProductCode);
    if (error) {
      setScanError(error);
      return;
    }
    if (!confirmOtherRouteIfNeeded(packingWorkRouteCode, result.order, result.cart)) {
      setScanError("Перевірку скасовано: невідповідність траси.");
      return;
    }
    setScanResult(result);
  };

  const handleQuickAddToBox = async (e) => {
    e.preventDefault();
    if (!scanResult || !quickAddBoxId) {
      toast.warning("Оберіть коробку або спочатку створіть нову.");
      return;
    }
    const ord = orderById(scanResult.order.id);
    if (!ord) {
      toast.error("Замовлення не знайдено — оновіть сторінку.");
      return;
    }
    const q = parseFloat(String(quickAddQty).replace(",", "."));
    if (!(q > 0)) {
      toast.warning("Вкажіть кількість більше 0.");
      return;
    }
    try {
      await addToPackingBox(Number(quickAddBoxId), ord, {
        orderItemId: scanResult.orderItem.id,
        sourceCartNumber: scanResult.cart.cartNumber,
        quantity: q,
      });
      toast.success("Додано в коробку");
      await load();
    } catch (err) {
      toast.error(err.response?.data || err.message || "Помилка");
    }
  };

  const openCartPreview = () => {
    const cn = scanCartNumber.trim();
    if (!cn) return;
    const entries = findCartsWithItemsByNumber(orders, cn);
    if (!entries.length) {
      toast.warning("У системі немає видачі товарів у візок з таким номером.");
      return;
    }
    if (!confirmOtherRouteForCartList(packingWorkRouteCode, entries)) return;
    setCartPreviewEntries(entries);
    setShowCartPreviewModal(true);
  };

  const handleCreateBoxFromForm = async (e) => {
    e.preventDefault();
    try {
      const created = await createPackingBox({
        clientName: boxClient.trim(),
        orderId: boxOrderId,
        cartNumber: null,
        workerNote: workerNote.trim(),
      });
      toast.success(
        `Коробку ${created.boxCode || created.labelNumber} створено — можна друкувати етикетку`
      );
      setShowBoxModal(false);
      load();
    } catch (err) {
      const msg = err.response?.data || err.message || "Помилка";
      toast.error(typeof msg === "string" ? msg : "Помилка");
    }
  };

  const handleDeleteBox = async (id) => {
    if (!window.confirm("Видалити запис коробки?")) return;
    try {
      await deletePackingBox(id, false);
      toast.success("Видалено");
      load();
    } catch (e) {
      const msg = e.response?.data || e.message || "";
      if (
        typeof msg === "string" &&
        msg.includes("є товар") &&
        window.confirm(`${msg}\n\nПримусово видалити коробку та записи вмісту?`)
      ) {
        try {
          await deletePackingBox(id, true);
          toast.success("Коробку видалено примусово");
          load();
        } catch (e2) {
          toast.error(e2.response?.data || "Помилка");
        }
      } else {
        toast.error(typeof msg === "string" ? msg : "Помилка");
      }
    }
  };

  const openAddModal = (bx) => {
    const ord = orderById(bx.orderId);
    if (!ord) {
      toast.error("Замовлення не знайдено — оновіть сторінку");
      return;
    }
    const carts = (ord.carts || []).filter((c) => c.items?.length);
    setAddTargetBox(bx);
    setAddCartNumber(carts[0]?.cartNumber ? String(carts[0].cartNumber) : "");
    setAddOrderItemId("");
    setAddQty("");
    setShowAddModal(true);
  };

  const addModalOrder = addTargetBox ? orderById(addTargetBox.orderId) : null;
  const addModalCart = addModalOrder
    ? (addModalOrder.carts || []).find((c) => String(c.cartNumber) === String(addCartNumber))
    : null;

  const addModalLineOptions = useMemo(() => {
    if (!addModalCart || !addModalOrder) return [];
    return (addModalCart.items || []).map((it) => {
      const oi = (addModalOrder.items || []).find((x) => Number(x.id) === Number(it.itemId));
      const cartQty = Number(it.quantity) || 0;
      const packed = packedForLine(addModalOrder.id, addModalCart.cartNumber, it.itemId);
      const remaining = Math.max(0, cartQty - packed);
      return {
        orderItemId: it.itemId,
        label: oi
          ? `${oi.productName} · ${it.containerCode} · у візку ${cartQty} (${oi.unitType || "од."})`
          : `Позиція #${it.itemId} · ${it.containerCode}`,
        remaining,
        oi,
        it,
      };
    });
  }, [addModalCart, addModalOrder, boxes]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addTargetBox || !addModalOrder) return;
    const q = parseFloat(String(addQty).replace(",", "."));
    try {
      await addToPackingBox(
        addTargetBox.id,
        addModalOrder,
        {
          orderItemId: addOrderItemId,
          sourceCartNumber: addCartNumber,
          quantity: q,
        }
      );
      toast.success("Додано в коробку");
      setShowAddModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data || err.message || "Помилка");
    }
  };

  const openTransferModal = (bx, line) => {
    setTransferFromBox(bx);
    setTransferLine(line);
    setTransferToBoxId("");
    setTransferQty(String(line.quantity));
    setShowTransferModal(true);
  };

  const transferTargets = useMemo(() => {
    if (!transferFromBox) return [];
    return boxes.filter(
      (b) => Number(b.orderId) === Number(transferFromBox.orderId) && b.id !== transferFromBox.id
    );
  }, [transferFromBox, boxes]);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferFromBox || !transferLine || !transferToBoxId) return;
    const ord = orderById(transferFromBox.orderId);
    if (!ord) {
      toast.error("Замовлення не знайдено");
      return;
    }
    const q = parseFloat(String(transferQty).replace(",", "."));
    try {
      await transferPackingBoxContent(
        transferFromBox.id,
        transferLine.id,
        Number(transferToBoxId),
        q,
        ord
      );
      toast.success("Перекладено");
      setShowTransferModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data || err.message || "Помилка");
    }
  };

  const printPackListHtmlDoc = (title, bodyInner) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; color: #111; }
  h1 { font-size: 18px; margin: 0 0 8px; }
  .meta { color: #444; font-size: 13px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; font-size: 13px; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
  th { background: #f4f4f4; }
  @media print { body { margin: 12px; } }
</style></head><body>
${bodyInner}
<script>window.onload=function(){window.print();}<\/script>
</body></html>`;

  const printPackListForBox = (bx) => {
    const ord = orderById(bx.orderId);
    const rows = (bx.contents || [])
      .map((c) => {
        const wu = Number(c.weightKg) || 0;
        const lw = (Number(c.quantity) || 0) * wu;
        return `<tr><td>${escapeHtml(c.productCode)}</td><td>${escapeHtml(c.productName)}</td><td>${escapeHtml(
          c.containerCode
        )}</td><td>${escapeHtml(c.sourceCartNumber)}</td><td>${escapeHtml(
          c.unitType || "—"
        )}</td><td>${escapeHtml(String(c.quantity))}</td><td>${escapeHtml(
          wu.toFixed(3)
        )}</td><td>${escapeHtml(lw.toFixed(2))}</td></tr>`;
      })
      .join("");
    const sumW = (bx.contents || []).reduce(
      (s, c) => s + lineTotalWeightKg(c.quantity, c.weightKg),
      0
    );
    const body = `
  <h1>Пакувальний лист (pack list) — ${escapeHtml(bx.boxCode || bx.labelNumber)}</h1>
  <div class="meta">
    ${escapeHtml(bx.displayName || bx.clientName || "")}<br/>
    Замовлення: #${escapeHtml(bx.orderId)} · ${escapeHtml(bx.clientName || "")}
    ${ord?.routeCode ? ` · траса ${escapeHtml(ord.routeCode)}` : ""}
    ${bx.workerNote ? `<br/>Примітка: ${escapeHtml(bx.workerNote)}` : ""}
    <br/><strong>Вага вмісту коробки (оцінка):</strong> ${escapeHtml(sumW.toFixed(2))} кг
  </div>
  <table><thead><tr><th>Код</th><th>Назва</th><th>Тара</th><th>Візок</th><th>Од.</th><th>К-сть</th><th>кг/од.</th><th>Вага ряд., кг</th></tr></thead>
  <tbody>${rows || '<tr><td colspan="8">Порожньо</td></tr>'}</tbody></table>`;
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Дозволіть спливаючі вікна для друку");
      return;
    }
    w.document.write(printPackListHtmlDoc(`Pack ${bx.boxCode}`, body));
    w.document.close();
  };

  const printPackListForOrder = (orderId) => {
    const ord = orderById(orderId);
    const list = boxes.filter((b) => Number(b.orderId) === Number(orderId));
    if (!list.length) {
      toast.info("Немає коробок для цього замовлення");
      return;
    }
    const sections = list
      .map((bx) => {
        const rows = (bx.contents || [])
          .map((c) => {
            const wu = Number(c.weightKg) || 0;
            const lw = (Number(c.quantity) || 0) * wu;
            return `<tr><td>${escapeHtml(c.productCode)}</td><td>${escapeHtml(c.productName)}</td><td>${escapeHtml(
              c.containerCode
            )}</td><td>${escapeHtml(c.sourceCartNumber)}</td><td>${escapeHtml(
              c.unitType || "—"
            )}</td><td>${escapeHtml(String(c.quantity))}</td><td>${escapeHtml(
              wu.toFixed(3)
            )}</td><td>${escapeHtml(lw.toFixed(2))}</td></tr>`;
          })
          .join("");
        const boxSum = (bx.contents || []).reduce(
          (s, c) => s + lineTotalWeightKg(c.quantity, c.weightKg),
          0
        );
        return `<h2 style="font-size:15px;margin:20px 0 8px">${escapeHtml(
          bx.boxCode || bx.labelNumber
        )} — ${escapeHtml(bx.displayName || "")} · вага: ${escapeHtml(boxSum.toFixed(2))} кг</h2>
        <table><thead><tr><th>Код</th><th>Назва</th><th>Тара</th><th>Візок</th><th>Од.</th><th>К-сть</th><th>кг/од.</th><th>Вага ряд., кг</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="8">Порожньо</td></tr>'}</tbody></table>`;
      })
      .join("");
    const body = `
  <h1>Пакувальний лист (pack list) — замовлення #${escapeHtml(orderId)}</h1>
  <div class="meta">${escapeHtml(ord?.clientName || "")}${
      ord?.routeCode ? ` · траса ${escapeHtml(ord.routeCode)}` : ""
    }</div>
  ${sections}`;
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Дозволіть спливаючі вікна для друку");
      return;
    }
    w.document.write(printPackListHtmlDoc(`Pack order ${orderId}`, body));
    w.document.close();
  };

  return (
    <Container className="mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <Button variant="outline-secondary" onClick={() => navigate("/")}>
          ← До стартової панелі
        </Button>
        <h1 className="mb-0">Пакування в коробки</h1>
      </div>
      <Alert variant="info" className="mb-3">
        Спочатку вкажіть <strong>трасу, на якій пакуєте</strong> (для попередження про чужі візки), потім{" "}
        <strong>номер візка</strong> — за потреби перегляньте вміст кнопкою під полем. Далі{" "}
        <strong>код товару або тари</strong> та «Перевірити». Покласти в коробку — у блоці «Коробка» праворуч або
        через «З візка» в таблиці нижче.
      </Alert>

      {loading ? (
        <p>Завантаження…</p>
      ) : (
        <>
          <Card className="mb-4 border-primary border-opacity-25">
            <Card.Body>
              <Row className="g-3 g-lg-4">
                <Col lg={8}>
                  <Card.Title className="mb-3">Візок і товар</Card.Title>
                  <Form.Group className="mb-3">
                    <Form.Label>Моя траса (робоче місце)</Form.Label>
                    <Form.Select
                      value={packingWorkRouteCode}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPackingWorkRouteCode(v);
                        try {
                          if (v) localStorage.setItem(PACKING_ROUTE_STORAGE_KEY, v);
                          else localStorage.removeItem(PACKING_ROUTE_STORAGE_KEY);
                        } catch {
                          /* ignore */
                        }
                      }}
                    >
                      <option value="">— Не обрано (не питати про чужу трасу) —</option>
                      {routeMasters.map((rm) => (
                        <option key={rm.routeCode} value={rm.routeCode}>
                          {rm.routeCode}
                          {rm.packingLineCode ? ` · ${rm.packingLineCode}` : ""}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Якщо обрано: при візку з <strong>іншої</strong> траси з’явиться підтвердження.
                    </Form.Text>
                  </Form.Group>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      runScanLookup();
                    }}
                  >
                    <Row className="g-2 mb-3">
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Номер візка</Form.Label>
                          <Form.Control
                            className="font-monospace"
                            value={scanCartNumber}
                            onChange={(e) => {
                              setScanCartNumber(e.target.value);
                              setScanResult(null);
                              setScanError("");
                            }}
                            placeholder="Скан або введіть №"
                            autoComplete="off"
                          />
                          {scanCartNumber.trim() ? (
                            <Button
                              type="button"
                              variant="outline-primary"
                              size="sm"
                              className="mt-2"
                              onClick={openCartPreview}
                            >
                              Переглянути товари у візку
                            </Button>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Код товару або тари</Form.Label>
                          <Form.Control
                            className="font-monospace"
                            value={scanProductCode}
                            onChange={(e) => {
                              setScanProductCode(e.target.value);
                              setScanResult(null);
                              setScanError("");
                            }}
                            placeholder="Скан ШК товару / коду тари"
                            autoComplete="off"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button type="submit" variant="primary">
                      Перевірити
                    </Button>
                  </Form>

                  {scanError ? (
                    <Alert variant="warning" className="mt-3 mb-0">
                      {scanError}
                    </Alert>
                  ) : null}

                  {scanResult ? (
                    <Alert variant="success" className="mt-3 mb-0">
                      <strong>Клієнт:</strong> {scanResult.order.clientName || "—"}
                      <br />
                      <strong>Замовлення:</strong> #{scanResult.order.id}
                      {scanResult.order.routeCode ? ` · траса ${scanResult.order.routeCode}` : ""}
                      <br />
                      <strong>Позиція:</strong> {scanResult.orderItem.productName} (
                      {scanResult.orderItem.productCode})
                      <br />
                      <strong>Тара:</strong> {scanResult.cartLine.containerCode} ·{" "}
                      <strong>у візку:</strong> {scanResult.cartLine.quantity}{" "}
                      {scanResult.orderItem.unitType || ""}
                      <br />
                      <strong>Залишок для пакування в коробки:</strong>{" "}
                      {Math.max(
                        0,
                        Number(scanResult.cartLine.quantity) -
                          packedForLine(
                            scanResult.order.id,
                            scanResult.cart.cartNumber,
                            scanResult.orderItem.id
                          )
                      )}
                      <br />
                      <strong>Вага одиниці:</strong>{" "}
                      {formatWeightKg(scanResult.orderItem.weightKg ?? 0)} ·{" "}
                      <strong>вага залишку (оцінка):</strong>{" "}
                      {formatWeightKg(
                        lineTotalWeightKg(
                          Math.max(
                            0,
                            Number(scanResult.cartLine.quantity) -
                              packedForLine(
                                scanResult.order.id,
                                scanResult.cart.cartNumber,
                                scanResult.orderItem.id
                              )
                          ),
                          scanResult.orderItem.weightKg
                        )
                      )}
                    </Alert>
                  ) : null}
                </Col>
                <Col lg={4}>
                  <div className="border rounded p-3 bg-light h-100 d-flex flex-column gap-2">
                    <span className="text-muted small text-uppercase">Коробка</span>
                    <Button
                      variant="success"
                      disabled={!scanResult}
                      onClick={() =>
                        openCreateBox(scanResult.order.id, scanResult.order.clientName)
                      }
                    >
                      Нова коробка для цього клієнта
                    </Button>
                    {scanResult ? (
                      <Form onSubmit={handleQuickAddToBox} className="d-flex flex-column gap-2 border-top pt-2 mt-1">
                        <span className="small fw-semibold">Додати перевірену позицію</span>
                        {boxesForOrder(scanResult.order.id).length === 0 ? (
                          <p className="small text-muted mb-0">
                            Ще немає коробок для цього замовлення — натисніть кнопку вище.
                          </p>
                        ) : (
                          <>
                            <Form.Group className="mb-0">
                              <Form.Label className="small mb-1">Коробка</Form.Label>
                              <Form.Select
                                size="sm"
                                value={quickAddBoxId}
                                onChange={(e) => setQuickAddBoxId(e.target.value)}
                                required
                              >
                                {boxesForOrder(scanResult.order.id).map((bx) => (
                                  <option key={bx.id} value={bx.id}>
                                    {bx.boxCode || bx.labelNumber}
                                    {bx.displayName ? ` · ${bx.displayName}` : ""}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-0">
                              <Form.Label className="small mb-1">Кількість</Form.Label>
                              <Form.Control
                                size="sm"
                                type="number"
                                step="any"
                                min={0.0001}
                                value={quickAddQty}
                                onChange={(e) => setQuickAddQty(e.target.value)}
                                disabled={
                                  Math.max(
                                    0,
                                    Number(scanResult.cartLine.quantity) -
                                      packedForLine(
                                        scanResult.order.id,
                                        scanResult.cart.cartNumber,
                                        scanResult.orderItem.id
                                      )
                                  ) <= 0
                                }
                              />
                            </Form.Group>
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={
                                !quickAddBoxId ||
                                Math.max(
                                  0,
                                  Number(scanResult.cartLine.quantity) -
                                    packedForLine(
                                      scanResult.order.id,
                                      scanResult.cart.cartNumber,
                                      scanResult.orderItem.id
                                    )
                                ) <= 0
                              }
                            >
                              Додати в коробку
                            </Button>
                          </>
                        )}
                      </Form>
                    ) : null}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={!scanResult}
                      onClick={() => printPackListForOrder(scanResult.order.id)}
                    >
                      Друк пакувального листа для всіх коробок цього замовлення
                    </Button>
                    <p className="small text-muted mb-0 mt-2">
                      Після перевірки з’являється «Додати в коробку» (якщо коробка вже створена).
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body className="py-2">
              <Button
                variant="link"
                className="text-decoration-none p-0"
                onClick={() => setShowReferenceCarts((v) => !v)}
              >
                {showReferenceCarts ? "▼" : "▶"} Довідково: усі візки з видавкою
              </Button>
              <Collapse in={showReferenceCarts}>
                <div className="mt-3">
                  {cartsWithContext.length === 0 ? (
                    <p className="text-muted mb-0">Немає візків з позиціями.</p>
                  ) : (
                    <Table responsive striped bordered hover size="sm" className="mb-0 align-middle">
                      <thead>
                        <tr>
                          <th>Замовлення</th>
                          <th>Клієнт</th>
                          <th>Траса</th>
                          <th>Лінія пак.</th>
                          <th>Стіл</th>
                          <th>Візок</th>
                          <th>Коробок (замовл.)</th>
                          <th>Позиції</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartsWithContext.map(({ order, cart }, idx) => (
                          <tr key={`${order.id}-${cart.cartNumber}-${idx}`}>
                            <td>#{order.id}</td>
                            <td>
                              <strong>{order.clientName || "—"}</strong>
                            </td>
                            <td>{cart.routeCode || order.routeCode || "—"}</td>
                            <td>{cart.packingLineCode || order.packingLineCode || "—"}</td>
                            <td>
                              {cart.packingTableCode ? (
                                <Badge bg="secondary">{cart.packingTableCode}</Badge>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>
                              <strong className="font-monospace">{cart.cartNumber}</strong>
                            </td>
                            <td>{boxCountForOrder(order.id)}</td>
                            <td>
                              <ul className="mb-0 ps-3 small">
                                {cart.items.map((it, i) => (
                                  <li key={i}>
                                    {it.containerCode}: {it.quantity}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Collapse>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Створені коробки</Card.Title>
              {boxes.length === 0 ? (
                <p className="text-muted mb-0">Поки порожньо</p>
              ) : (
                <Table responsive striped size="sm" className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Код коробки</th>
                      <th>Назва на етикетці</th>
                      <th>Клієнт</th>
                      <th>Замовл.</th>
                      <th>Вміст (рядки)</th>
                      <th>Вага вмісту</th>
                      <th>Примітка</th>
                      <th>Час</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {boxes.map((bx) => {
                      const contents = bx.contents || [];
                      const open = expandedBoxIds.has(bx.id);
                      return (
                        <Fragment key={bx.id}>
                          <tr>
                            <td>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-decoration-none p-0"
                                onClick={() => toggleExpand(bx.id)}
                                aria-expanded={open}
                              >
                                {open ? "▼" : "▶"}
                              </Button>
                            </td>
                            <td>
                              <strong className="font-monospace">{bx.boxCode || bx.labelNumber}</strong>
                            </td>
                            <td>{bx.displayName || bx.clientName}</td>
                            <td>{bx.clientName}</td>
                            <td>{bx.orderId ? `#${bx.orderId}` : "—"}</td>
                            <td>{contents.length}</td>
                            <td className="small text-nowrap">
                              {formatWeightKg(
                                contents.reduce(
                                  (s, line) =>
                                    s + lineTotalWeightKg(line.quantity, line.weightKg),
                                  0
                                )
                              )}
                            </td>
                            <td className="small text-muted">{bx.workerNote || "—"}</td>
                            <td className="small">{new Date(bx.createdAt).toLocaleString("uk-UA")}</td>
                            <td className="text-nowrap">
                              <Button
                                size="sm"
                                variant="primary"
                                className="me-1"
                                onClick={() => openAddModal(bx)}
                              >
                                З візка
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="me-1"
                                onClick={() => printPackListForBox(bx)}
                              >
                                Пакувальний лист
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteBox(bx.id)}
                              >
                                Видалити
                              </Button>
                            </td>
                          </tr>
                          <tr className="bg-light">
                            <td colSpan={10} className="border-top-0 p-0">
                              <Collapse in={open}>
                                <div className="p-2">
                                  {contents.length === 0 ? (
                                    <p className="small text-muted mb-0">У коробці ще нічого немає.</p>
                                  ) : (
                                    <Table responsive size="sm" bordered className="mb-0 bg-white">
                                      <thead>
                                        <tr>
                                          <th>Код</th>
                                          <th>Назва</th>
                                          <th>Тара</th>
                                          <th>Візок</th>
                                          <th>Од.</th>
                                          <th>К-сть</th>
                                          <th>кг/од.</th>
                                          <th>Вага ряд.</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {contents.map((line) => (
                                          <tr key={line.id}>
                                            <td className="font-monospace small">{line.productCode}</td>
                                            <td>{line.productName}</td>
                                            <td>{line.containerCode}</td>
                                            <td>{line.sourceCartNumber}</td>
                                            <td>{line.unitType || "—"}</td>
                                            <td>{line.quantity}</td>
                                            <td className="small">
                                              {(Number(line.weightKg) || 0).toFixed(3)}
                                            </td>
                                            <td className="small text-nowrap">
                                              {formatWeightKg(
                                                lineTotalWeightKg(line.quantity, line.weightKg)
                                              )}
                                            </td>
                                            <td>
                                              <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => openTransferModal(bx, line)}
                                              >
                                                Перекласти
                                              </Button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  )}
                                </div>
                              </Collapse>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </>
      )}

      <Modal show={showBoxModal} onHide={() => setShowBoxModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Нова коробка</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateBoxFromForm}>
          <Modal.Body>
            <p className="small text-muted mb-3">
              Код коробки присвоїться <strong>автоматично</strong>. Назва на етикетці — за клієнтом і
              порядковим номером коробки для цього <strong>замовлення</strong> (без прив’язки до візка).
            </p>
            <Form.Group className="mb-2">
              <Form.Label>Клієнт (з видавки)</Form.Label>
              <Form.Control value={boxClient} readOnly plaintext className="border rounded px-2 py-1 bg-light" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Замовлення</Form.Label>
              <Form.Control
                readOnly
                plaintext
                className="border rounded px-2 py-1 bg-light"
                value={boxOrderId != null ? `#${boxOrderId}` : "—"}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Додаткова примітка на етикетці (необов’язково)</Form.Label>
              <Form.Control
                value={workerNote}
                onChange={(e) => setWorkerNote(e.target.value)}
                placeholder="Напр. крихке, перевірити ущільнення"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={() => setShowBoxModal(false)}>
              Скасувати
            </Button>
            <Button type="submit" variant="primary">
              Створити коробку
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Покласти з візка в коробку{" "}
            {addTargetBox ? (
              <span className="font-monospace">{addTargetBox.boxCode || addTargetBox.labelNumber}</span>
            ) : null}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            {!addModalOrder ? (
              <p className="text-muted">Немає даних замовлення</p>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Візок</Form.Label>
                  <Form.Select
                    value={addCartNumber}
                    onChange={(e) => {
                      setAddCartNumber(e.target.value);
                      setAddOrderItemId("");
                    }}
                    required
                  >
                    {(addModalOrder.carts || [])
                      .filter((c) => c.items?.length)
                      .map((c) => (
                        <option key={c.cartNumber} value={c.cartNumber}>
                          {c.cartNumber}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Позиція</Form.Label>
                  <Form.Select
                    value={addOrderItemId}
                    onChange={(e) => setAddOrderItemId(e.target.value)}
                    required
                  >
                    <option value="">— оберіть —</option>
                    {addModalLineOptions.map((opt) => (
                      <option key={opt.orderItemId} value={opt.orderItemId} disabled={opt.remaining <= 0}>
                        {opt.label} — залишок для пакування: {opt.remaining}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Кількість</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    min={0.0001}
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                    required
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
              Скасувати
            </Button>
            <Button type="submit" variant="primary" disabled={!addModalOrder}>
              Додати
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Перекласти в іншу коробку</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransferSubmit}>
          <Modal.Body>
            {transferLine && transferFromBox ? (
              <p className="small">
                З <strong className="font-monospace">
                  {transferFromBox.boxCode || transferFromBox.labelNumber}
                </strong>
                : {transferLine.productName} — у коробці зараз <strong>{transferLine.quantity}</strong>
                {transferLine.weightKg != null ? (
                  <>
                    {" "}
                    · <strong>{formatWeightKg(Number(transferLine.weightKg) || 0)}</strong> за од.
                  </>
                ) : null}
                .
              </p>
            ) : null}
            <Form.Group className="mb-3">
              <Form.Label>Цільова коробка (те саме замовлення)</Form.Label>
              <Form.Select
                value={transferToBoxId}
                onChange={(e) => setTransferToBoxId(e.target.value)}
                required
              >
                <option value="">— оберіть —</option>
                {transferTargets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.boxCode || b.labelNumber} — {b.displayName || b.clientName}
                  </option>
                ))}
              </Form.Select>
              {transferTargets.length === 0 ? (
                <Form.Text className="text-warning">
                  Немає іншої коробки для цього замовлення — спочатку створіть другу.
                </Form.Text>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Кількість</Form.Label>
              <Form.Control
                type="number"
                step="any"
                min={0.0001}
                value={transferQty}
                onChange={(e) => setTransferQty(e.target.value)}
                required
              />
              {transferLine ? (
                <Form.Text className="text-muted">
                  Вага перекладу (оцінка):{" "}
                  {formatWeightKg(
                    lineTotalWeightKg(
                      parseFloat(String(transferQty).replace(",", ".")) || 0,
                      transferLine.weightKg
                    )
                  )}
                </Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={() => setShowTransferModal(false)}>
              Скасувати
            </Button>
            <Button type="submit" variant="primary" disabled={transferTargets.length === 0}>
              Перекласти
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showCartPreviewModal}
        onHide={() => setShowCartPreviewModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Візок <span className="font-monospace">{scanCartNumber.trim()}</span> — що всередині
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartPreviewEntries.length > 1 ? (
            <Alert variant="secondary" className="py-2 small mb-3">
              Увага: у системі кілька видач з цим номером візка — показано всі рядки.
            </Alert>
          ) : null}
          <Table responsive size="sm" bordered hover className="mb-0">
            <thead>
              <tr>
                <th>Замовл.</th>
                <th>Клієнт</th>
                <th>Траса</th>
                <th>Тара</th>
                <th>Код товару</th>
                <th>Назва</th>
                <th>К-сть</th>
                <th>кг/од.</th>
                <th>Вага ряд., кг</th>
              </tr>
            </thead>
            <tbody>
              {cartPreviewEntries.flatMap(({ order, cart }) =>
                (cart.items || []).map((it, idx) => {
                  const oi = (order.items || []).find((i) => Number(i.id) === Number(it.itemId));
                  return (
                    <tr key={`${order.id}-${cart.cartNumber}-${it.itemId}-${idx}-${it.containerCode}`}>
                      <td>#{order.id}</td>
                      <td>{order.clientName || "—"}</td>
                      <td>
                        <Badge bg={cartRouteLabel(order, cart) ? "secondary" : "light"} text="dark">
                          {cartRouteLabel(order, cart) || "—"}
                        </Badge>
                      </td>
                      <td className="font-monospace small">{it.containerCode}</td>
                      <td className="font-monospace small">{oi?.productCode || "—"}</td>
                      <td>{oi?.productName || "—"}</td>
                      <td>
                        {it.quantity}
                        {oi?.unitType ? ` ${oi.unitType}` : ""}
                      </td>
                      <td className="small">{(Number(oi?.weightKg) || 0).toFixed(3)}</td>
                      <td className="small">
                        {formatWeightKg(lineTotalWeightKg(it.quantity, oi?.weightKg))}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartPreviewModal(false)}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PackingStationPage;
