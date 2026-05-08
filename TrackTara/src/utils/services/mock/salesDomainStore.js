/**
 * Доменні дані: клієнти, траси (маршрути), лінії пакування, столи.
 * Траса — довільний короткий код (2 символи: літери/цифри), до неї прив’язані лінія пакування та столи.
 */

import { defineTable, replaceArray } from './_mockDb';

/** @typedef {{ id: number, name: string, routeCode: string }} Client */

/** @typedef {{ routeCode: string, packingLineCode: string, packingTableCodes: string[] }} RouteMaster */

const mockClients = defineTable('clients', [
  { id: 1, name: 'ТОВ «Рітейл Захід»', routeCode: 'AC' },
  { id: 2, name: 'ФОП Іваненко', routeCode: 'HR' },
]);

const mockRouteMasters = defineTable('routeMasters', [
  { routeCode: 'AC', packingLineCode: 'PACK-LINE-AC', packingTableCodes: ['ST-AC-1', 'ST-AC-2'] },
  { routeCode: 'HR', packingLineCode: 'PACK-LINE-HR', packingTableCodes: ['ST-HR-1'] },
  { routeCode: 'HC', packingLineCode: 'PACK-LINE-HC', packingTableCodes: ['ST-HC-1', 'ST-HC-2'] },
]);

/**
 * @typedef {{
 *   id: string,
 *   orderItemId: number,
 *   sourceCartNumber: string,
 *   productCode: string,
 *   productName: string,
 *   containerCode: string,
 *   unitType: string,
 *   quantity: number,
 *   weightKg: number
 * }} PackingBoxContentLine
 *
 * @typedef {{
 *   id: number,
 *   boxCode: string,
 *   displayName: string,
 *   labelNumber: string,
 *   clientName: string,
 *   orderId: number|null,
 *   cartNumber: string|null,
 *   sequence: number,
 *   workerNote: string,
 *   createdAt: string,
 *   contents: PackingBoxContentLine[]
 * }} PackingBox
 */

const mockBoxes = defineTable('packingBoxes', []);
const _boxMeta = defineTable('packingBoxMeta', { lineUid: 1 });
const nextPackingLineId = () => `PLC-${Date.now()}-${_boxMeta.lineUid++}`;

function generateBoxCode() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `BX-${y}${m}${day}-${rand}`;
}

export const normalizeRouteCode = (code) =>
  String(code || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);

export const getClients = () => JSON.parse(JSON.stringify(mockClients));

export const getClientById = (id) =>
  mockClients.find((c) => c.id === Number(id)) || null;

export const createClient = ({ name, routeCode }) => {
  const rc = normalizeRouteCode(routeCode);
  if (!name?.trim()) throw new Error('Вкажіть назву клієнта');
  if (!rc || rc.length < 2) throw new Error('Трасу вкажіть мінімум 2 символи (літери/цифри)');
  if (!mockRouteMasters.some((r) => r.routeCode === rc)) {
    throw new Error(`Спочатку додайте трасу ${rc} у довіднику (лінія та столи)`);
  }
  const id = Math.max(0, ...mockClients.map((c) => c.id)) + 1;
  const row = { id, name: name.trim(), routeCode: rc };
  mockClients.push(row);
  return { ...row };
};

export const updateClient = (id, { name, routeCode }) => {
  const idx = mockClients.findIndex((c) => c.id === Number(id));
  if (idx === -1) throw new Error('Клієнт не знайдений');
  const rc = normalizeRouteCode(routeCode);
  if (!name?.trim()) throw new Error('Вкажіть назву клієнта');
  if (!rc || rc.length < 2) throw new Error('Трасу вкажіть мінімум 2 символи');
  if (!mockRouteMasters.some((r) => r.routeCode === rc)) {
    throw new Error(`Траса ${rc} не знайдена в довіднику`);
  }
  mockClients[idx] = { ...mockClients[idx], name: name.trim(), routeCode: rc };
  return { ...mockClients[idx] };
};

export const deleteClient = (id) => {
  replaceArray(mockClients, mockClients.filter((c) => c.id !== Number(id)));
};

export const getRouteMasters = () => JSON.parse(JSON.stringify(mockRouteMasters));

export const createRouteMaster = ({ routeCode, packingLineCode, packingTableCodes }) => {
  const rc = normalizeRouteCode(routeCode);
  if (!rc || rc.length < 2) throw new Error('Некоректна траса');
  if (!packingLineCode?.trim()) throw new Error('Вкажіть лінію пакування');
  const tables = Array.isArray(packingTableCodes)
    ? packingTableCodes.map((t) => String(t).trim()).filter(Boolean)
    : String(packingTableCodes || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
  if (tables.length === 0) throw new Error('Додайте хоча б один стіл пакування');
  if (mockRouteMasters.some((r) => r.routeCode === rc)) {
    throw new Error('Така траса вже існує');
  }
  const row = {
    routeCode: rc,
    packingLineCode: packingLineCode.trim(),
    packingTableCodes: tables,
  };
  mockRouteMasters.push(row);
  return { ...row };
};

export const deleteRouteMaster = (routeCode) => {
  const rc = normalizeRouteCode(routeCode);
  if (mockClients.some((c) => c.routeCode === rc)) {
    throw new Error('Є клієнти з цією трасою — спочатку змініть їм траси');
  }
  replaceArray(mockRouteMasters, mockRouteMasters.filter((r) => r.routeCode !== rc));
};

export const getRouteMasterByCode = (routeCode) => {
  const rc = normalizeRouteCode(routeCode);
  return mockRouteMasters.find((r) => r.routeCode === rc) || null;
};

/**
 * Стіл для нового візка: перший зі списку (автолінія); у проді можна чергувати.
 */
export const resolvePackingTableForCart = (routeCode) => {
  const master = getRouteMasterByCode(routeCode);
  if (!master?.packingTableCodes?.length) return null;
  return master.packingTableCodes[0];
};

export const getBoxes = () =>
  JSON.parse(JSON.stringify(mockBoxes.map((b) => ({ ...b, contents: b.contents || [] }))));

export const getBoxById = (id) => {
  const b = mockBoxes.find((x) => x.id === Number(id));
  if (!b) return null;
  return JSON.parse(JSON.stringify({ ...b, contents: b.contents || [] }));
};

/** Скільки вже поклали в усі коробки з цієї лінії візка. */
export const getPackedQuantityForCartLine = (orderId, sourceCartNumber, orderItemId) => {
  let sum = 0;
  for (const b of mockBoxes) {
    if (Number(b.orderId) !== Number(orderId)) continue;
    for (const c of b.contents || []) {
      if (
        Number(c.orderItemId) === Number(orderItemId) &&
        String(c.sourceCartNumber) === String(sourceCartNumber)
      ) {
        sum += Number(c.quantity) || 0;
      }
    }
  }
  return sum;
};

/**
 * Нова коробка для замовлення: код автоматично; порядковий № по замовленню (візок не обов’язковий).
 */
export const createPackingBox = ({
  clientName,
  orderId = null,
  cartNumber = null,
  workerNote = '',
}) => {
  if (!clientName?.trim()) throw new Error('Не вказано клієнта (одержувача видавки)');
  const oid = orderId != null ? Number(orderId) : null;
  if (oid == null || Number.isNaN(oid)) throw new Error('Оберіть замовлення');
  const cart =
    cartNumber != null && String(cartNumber).trim()
      ? String(cartNumber).trim()
      : null;
  const sameOrder = mockBoxes.filter((b) => b.orderId === oid);
  const sequence = sameOrder.length + 1;
  const boxCode = generateBoxCode();
  const client = clientName.trim();
  const displayName = `${client} · коробка ${sequence}`;
  const id = Math.max(0, ...mockBoxes.map((b) => b.id)) + 1;
  const row = {
    id,
    boxCode,
    displayName,
    labelNumber: boxCode,
    clientName: client,
    orderId: oid,
    cartNumber: cart,
    sequence,
    workerNote: String(workerNote || '').trim(),
    createdAt: new Date().toISOString(),
    contents: [],
  };
  mockBoxes.push(row);
  return getBoxById(row.id);
};

/**
 * Покласти в коробку кількість товару з позиції візка (залишок = у візку − уже в коробках).
 */
export const addContentsToBox = (boxId, order, { orderItemId, sourceCartNumber, quantity }) => {
  const box = mockBoxes.find((b) => b.id === Number(boxId));
  if (!box) throw new Error('Коробку не знайдено');
  if (!order || Number(order.id) !== Number(box.orderId)) throw new Error('Невідповідність замовлення');
  const cartNum = String(sourceCartNumber ?? '').trim();
  if (!cartNum) throw new Error('Оберіть візок');
  const cart = (order.carts || []).find((c) => String(c.cartNumber) === cartNum);
  if (!cart) throw new Error('Візок не знайдено в цьому замовленні');
  const line = (cart.items || []).find((li) => Number(li.itemId) === Number(orderItemId));
  if (!line) throw new Error('У візку немає такої позиції');
  const cartQty = Number(line.quantity) || 0;
  const packed = getPackedQuantityForCartLine(order.id, cartNum, orderItemId);
  const remaining = cartQty - packed;
  const q = Number(quantity);
  if (q <= 0 || Number.isNaN(q)) throw new Error('Вкажіть кількість більше 0');
  if (q > remaining + 1e-9) {
    throw new Error(`У візку для пакування залишилось не більше ${remaining}`);
  }
  const oi = (order.items || []).find((i) => Number(i.id) === Number(orderItemId));
  if (!oi) throw new Error('Рядок замовлення не знайдено');
  if (!box.contents) box.contents = [];
  box.contents.push({
    id: nextPackingLineId(),
    orderItemId: Number(orderItemId),
    sourceCartNumber: cartNum,
    productCode: oi.productCode,
    productName: oi.productName,
    containerCode: oi.containerCode,
    unitType: oi.unitType || '',
    quantity: q,
    weightKg: Number(oi.weightKg) || 0,
  });
  return getBoxById(box.id);
};

/** Перекласти між коробками одного замовлення. */
export const transferBoxContent = (fromBoxId, contentId, toBoxId, quantity, order) => {
  const fromB = mockBoxes.find((b) => b.id === Number(fromBoxId));
  const toB = mockBoxes.find((b) => b.id === Number(toBoxId));
  if (!fromB || !toB) throw new Error('Коробку не знайдено');
  if (fromB.id === toB.id) throw new Error('Оберіть іншу коробку');
  if (Number(fromB.orderId) !== Number(toB.orderId)) throw new Error('Коробки з різних замовлень');
  if (!order || Number(order.id) !== Number(fromB.orderId)) throw new Error('Невідповідність замовлення');
  const contents = fromB.contents || [];
  const idx = contents.findIndex((c) => c.id === contentId);
  if (idx === -1) throw new Error('Рядок у коробці не знайдено');
  const row = contents[idx];
  const q = Number(quantity);
  if (q <= 0 || q > row.quantity) throw new Error('Некоректна кількість');
  if (q < row.quantity) {
    row.quantity -= q;
  } else {
    contents.splice(idx, 1);
  }
  if (!toB.contents) toB.contents = [];
  const match = toB.contents.find(
    (c) =>
      c.orderItemId === row.orderItemId &&
      String(c.sourceCartNumber) === String(row.sourceCartNumber) &&
      c.productCode === row.productCode &&
      Number(c.weightKg || 0) === Number(row.weightKg || 0)
  );
  if (match) {
    match.quantity += q;
  } else {
    toB.contents.push({
      ...row,
      id: nextPackingLineId(),
      quantity: q,
    });
  }
  return { fromBox: getBoxById(fromB.id), toBox: getBoxById(toB.id) };
};

export const deletePackingBox = (id, force = false) => {
  const b = mockBoxes.find((x) => x.id === Number(id));
  if (!b) return;
  if ((b.contents || []).length > 0 && !force) {
    throw new Error(
      'У коробці є товар. Перекладіть вміст в іншу коробку або підтвердіть примусове видалення.'
    );
  }
  replaceArray(mockBoxes, mockBoxes.filter((x) => x.id !== Number(id)));
};
