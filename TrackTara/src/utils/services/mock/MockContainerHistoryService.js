// Mock Container History Service — журнал подій контейнера (лише додавання записів).
// Жоден попередній рядок не змінюється після наступних операцій: кожне покладання / знімання — окремий факт.

import { defineTable } from './_mockDb';

const MOCK_DELAY = 300;

const mockContainerHistories = defineTable('containerHistories', [
  {
    id: 1,
    containerId: 1,
    productId: 1,
    startDate: '2024-01-15T10:30:00',
    endDate: null,
    userLogin: 'operator@test.com',
    action: 'placed',
    quantity: 35,
  },
  {
    id: 2,
    containerId: 2,
    productId: null,
    startDate: '2024-01-10T08:00:00',
    endDate: '2024-01-12T14:20:00',
    userLogin: 'admin@test.com',
    action: 'removed',
    quantity: 30,
  },
  {
    id: 3,
    containerId: 2,
    productId: 2,
    startDate: '2024-01-12T14:25:00',
    endDate: '2024-01-14T16:45:00',
    userLogin: 'operator@test.com',
    action: 'removed',
    quantity: 25,
  },
  {
    id: 4,
    containerId: 3,
    productId: 3,
    startDate: '2024-01-14T09:15:00',
    endDate: null,
    userLogin: 'operator@test.com',
    action: 'placed',
    quantity: 20,
  },
  {
    id: 5,
    containerId: 1,
    productId: null,
    startDate: '2024-01-05T11:00:00',
    endDate: '2024-01-10T15:30:00',
    userLogin: 'admin@test.com',
    action: 'removed',
  },
]);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const nextHistoryId = () => Math.max(0, ...mockContainerHistories.map((h) => h.id)) + 1;

export const getAllContainerHistories = async (containerId) => {
  await delay(MOCK_DELAY);
  const histories = mockContainerHistories.filter(h => h.containerId === parseInt(containerId));
  const sorted = [...histories].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  return sorted.map((h) => ({ ...h }));
};

export const getContainerHistoryById = async (containerHistoryId) => {
  await delay(MOCK_DELAY);
  const history = mockContainerHistories.find(h => h.id === parseInt(containerHistoryId));
  if (!history) {
    throw {
      response: {
        data: 'Container history not found',
        status: 404,
      },
    };
  }
  return { ...history };
};

/**
 * Лише нові записи в кінець масиву; існуючі id не перезаписуються.
 * @param {'created'|'placed'|'removed'} action
 * @param {number|null} quantity — для placed: обсяг цієї операції; для removed: знято за раз
 * @param {{ orderId?: number, orderItemId?: number }} [meta] — лише для removed (комплектація); зберігається в записі
 */
export const addContainerHistory = async (
  containerId,
  productId,
  action,
  userLogin,
  quantity = null,
  meta = {},
) => {
  await delay(MOCK_DELAY);
  const newId = nextHistoryId();
  const now = new Date().toISOString();

  if (action === 'created') {
    const newHistory = {
      id: newId,
      containerId: parseInt(containerId),
      productId: null,
      startDate: now,
      endDate: null,
      userLogin: userLogin || 'unknown@test.com',
      action: 'created',
      quantity: 0,
    };
    mockContainerHistories.push(newHistory);
    return newHistory;
  }

  if (action === 'placed') {
    const cid = parseInt(containerId);
    const pid = productId != null ? parseInt(productId) : null;
    const addQty = quantity != null ? Number(quantity) : 0;
    const row = {
      id: newId,
      containerId: cid,
      productId: pid,
      startDate: now,
      endDate: now,
      userLogin: userLogin || 'unknown@test.com',
      action: 'placed',
      quantity: addQty,
    };
    mockContainerHistories.push(row);
    return row;
  }

  if (action === 'removed') {
    const cid = parseInt(containerId);
    const pid = productId != null ? parseInt(productId) : null;
    const qtyRemoved =
      quantity !== null && quantity !== undefined ? Number(quantity) : 0;

    const row = {
      id: newId,
      containerId: cid,
      productId: pid,
      startDate: now,
      endDate: now,
      userLogin: userLogin || 'unknown@test.com',
      action: 'removed',
      quantity: qtyRemoved,
    };
    if (meta && meta.orderId != null && meta.orderId !== undefined) {
      row.orderId = meta.orderId;
      row.orderItemId = meta.orderItemId ?? null;
    }
    mockContainerHistories.push(row);
    return row;
  }

  return null;
};

export { mockContainerHistories };
