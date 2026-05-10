import { lineTotalWeightKg } from "../helpers/productWeight";

export function normalizeOrderRoute(order) {
  const rc = order?.routeCode;
  if (rc == null || String(rc).trim() === "") return "—";
  return String(rc).trim().toUpperCase();
}

export function isActiveWorkloadOrder(o) {
  const s = String(o?.status ?? "active").toLowerCase();
  return s === "active";
}

/**
 * Агрегація завантаженості трас для адмін-дашборду (чиста функція — покрита тестами).
 */
export function buildRouteWorkloadTable(orders, boxes) {
  const orderList = Array.isArray(orders) ? orders : [];
  const boxList = Array.isArray(boxes) ? boxes : [];

  const orderIdToRoute = new Map();
  for (const o of orderList) {
    orderIdToRoute.set(Number(o.id), normalizeOrderRoute(o));
  }

  const routeAgg = new Map();
  const ensureRoute = (key) => {
    if (!routeAgg.has(key)) {
      routeAgg.set(key, {
        routeCode: key,
        orders: 0,
        itemsTotal: 0,
        itemsDone: 0,
        itemsPending: 0,
        itemsInProgress: 0,
        cartsActive: 0,
        uniqueContainers: new Set(),
        remainingWeightKg: 0,
        packingBoxes: 0,
      });
    }
    return routeAgg.get(key);
  };

  for (const o of orderList) {
    if (!isActiveWorkloadOrder(o)) continue;
    const rk = normalizeOrderRoute(o);
    const agg = ensureRoute(rk);
    agg.orders += 1;
    const orderItems = Array.isArray(o.items) ? o.items : [];
    for (const it of orderItems) {
      agg.itemsTotal += 1;
      const st = String(it?.status || "pending").toLowerCase();
      if (st === "completed") agg.itemsDone += 1;
      else if (st === "in_progress") agg.itemsInProgress += 1;
      else agg.itemsPending += 1;
      if (it?.containerCode) agg.uniqueContainers.add(String(it.containerCode));
      const q = Number(it.quantity) || 0;
      const picked = Number(it.pickedQuantity) || 0;
      const rem = Math.max(0, q - picked);
      agg.remainingWeightKg += lineTotalWeightKg(rem, it.weightKg);
    }
    const carts = Array.isArray(o.carts) ? o.carts : [];
    for (const c of carts) {
      if (!c?.leftOnLine) agg.cartsActive += 1;
    }
  }

  for (const b of boxList) {
    const oid = b?.orderId != null ? Number(b.orderId) : null;
    const rk = oid != null && orderIdToRoute.has(oid) ? orderIdToRoute.get(oid) : "—";
    ensureRoute(rk).packingBoxes += 1;
  }

  return Array.from(routeAgg.values())
    .filter((a) => a.orders > 0 || a.itemsTotal > 0 || a.packingBoxes > 0)
    .map((a) => {
      const pendingLines = a.itemsPending + a.itemsInProgress;
      const progressPct =
        a.itemsTotal > 0 ? Math.round((a.itemsDone / a.itemsTotal) * 100) : 100;
      const needHelp =
        pendingLines >= 6 ||
        a.remainingWeightKg >= 80 ||
        (a.cartsActive >= 4 && pendingLines >= 2);
      return {
        routeCode: a.routeCode,
        orders: a.orders,
        itemsTotal: a.itemsTotal,
        itemsDone: a.itemsDone,
        itemsPending: a.itemsPending,
        itemsInProgress: a.itemsInProgress,
        pendingLines,
        cartsActive: a.cartsActive,
        uniqueContainers: a.uniqueContainers.size,
        remainingWeightKg: a.remainingWeightKg,
        packingBoxes: a.packingBoxes,
        progressPct,
        needHelp,
      };
    })
    .sort((x, y) => {
      if (y.pendingLines !== x.pendingLines) return y.pendingLines - x.pendingLines;
      if (y.remainingWeightKg !== x.remainingWeightKg) return y.remainingWeightKg - x.remainingWeightKg;
      return y.orders - x.orders;
    });
}
