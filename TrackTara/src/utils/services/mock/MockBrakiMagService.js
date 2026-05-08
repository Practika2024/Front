// Mock BrakiMag Service - реєстр бракованих товарів

import { defineTable } from './_mockDb';

const MOCK_DELAY = 100;

// Реєстр бракованих товарів
const brakiMagItems = defineTable('brakiMag', [
  {
    id: 1,
    productId: 1,
    productName: 'Молоко 3.2%',
    productCode: 'PRD-001',
    containerCode: 'A01-CNT-001',
    quantity: 5,
    unitType: 'liters',
    weightKg: 1.03,
    reason: 'Не вистачило товару',
    orderId: 1,
    addedBy: 'operator@test.com',
    addedAt: '2024-01-20T10:30:00',
  },
  {
    id: 2,
    productId: 2,
    productName: 'Хліб білий',
    productCode: 'PRD-002',
    containerCode: 'A01-CNT-002',
    quantity: 3,
    unitType: 'pieces',
    weightKg: 0.45,
    reason: 'Не знайшли потрібної кількості',
    orderId: 1,
    addedBy: 'operator@test.com',
    addedAt: '2024-01-20T11:00:00',
  },
  {
    id: 3,
    productId: 7,
    productName: 'М\'ясо свиняче',
    productCode: 'PRD-007',
    containerCode: 'B02-CNT-009',
    quantity: 2,
    unitType: 'kilograms',
    weightKg: 1,
    reason: 'Пошкоджений товар',
    orderId: 2,
    addedBy: 'operator@test.com',
    addedAt: '2024-01-20T11:30:00',
  },
]);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Допоміжна функція для отримання логіну користувача з токену
const getUserLoginFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return 'unknown';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.email || 'unknown';
  } catch (error) {
    return 'unknown';
  }
};

// Отримати всі товари з бракімагу
export const getAllBrakiMagItems = async () => {
  await delay(MOCK_DELAY);
  return JSON.parse(JSON.stringify(brakiMagItems));
};

// Додати товар до бракімагу
export const addToBrakiMag = async (itemData) => {
  await delay(MOCK_DELAY);
  const userLogin = getUserLoginFromToken();
  
  const newItem = {
    id: Math.max(...brakiMagItems.map(i => i.id), 0) + 1,
    productId: itemData.productId,
    productName: itemData.productName,
    productCode: itemData.productCode,
    containerCode: itemData.containerCode || null,
    quantity: itemData.quantity,
    unitType: itemData.unitType || 'liters',
    weightKg: itemData.weightKg != null ? Number(itemData.weightKg) : 0,
    reason: itemData.reason || 'Не вистачило товару',
    orderId: itemData.orderId || null,
    addedBy: userLogin,
    addedAt: new Date().toISOString(),
  };
  
  brakiMagItems.push(newItem);
  return JSON.parse(JSON.stringify(newItem));
};

// Видалити товар з бракімагу
export const removeFromBrakiMag = async (itemId) => {
  await delay(MOCK_DELAY);
  const index = brakiMagItems.findIndex(item => item.id === parseInt(itemId));
  if (index === -1) {
    throw {
      response: {
        data: 'Товар не знайдено в бракімагу',
        status: 404,
      },
    };
  }
  
  brakiMagItems.splice(index, 1);
  return { success: true };
};

// Оновити товар в бракімагу
export const updateBrakiMagItem = async (itemId, updateData) => {
  await delay(MOCK_DELAY);
  const item = brakiMagItems.find(i => i.id === parseInt(itemId));
  if (!item) {
    throw {
      response: {
        data: 'Товар не знайдено в бракімагу',
        status: 404,
      },
    };
  }
  
  Object.assign(item, updateData, {
    updatedAt: new Date().toISOString(),
  });
  
  return JSON.parse(JSON.stringify(item));
};

/**
 * Частково або повністю забрати з реєстру нестач і покласти в контейнер (спочатку оновлення тури — брак лише після успіху).
 */
export const transferBrakiMagToContainer = async (brakiMagItemId, containerId, quantity) => {
  await delay(MOCK_DELAY);
  const idx = brakiMagItems.findIndex((i) => i.id === parseInt(brakiMagItemId));
  if (idx === -1) {
    throw {
      response: { data: 'Запис не знайдено в реєстрі нестач', status: 404 },
    };
  }
  const entry = brakiMagItems[idx];
  const q = parseFloat(String(quantity).replace(',', '.'));
  const max = Number(entry.quantity) || 0;
  if (!(q > 0) || Number.isNaN(q)) {
    throw {
      response: { data: 'Вкажіть кількість більше 0', status: 400 },
    };
  }
  if (q > max + 1e-9) {
    throw {
      response: {
        data: `У браку лише ${max}; не можна забрати ${q}`,
        status: 400,
      },
    };
  }

  const { setProductToContainer } = await import('./MockContainerService');
  let updatedContainer;
  try {
    updatedContainer = await setProductToContainer(
      parseInt(containerId),
      entry.productId,
      q,
    );
  } catch (e) {
    throw e;
  }

  entry.quantity = max - q;
  if (entry.quantity <= 1e-9) {
    brakiMagItems.splice(idx, 1);
  }

  return JSON.parse(
    JSON.stringify({
      container: updatedContainer,
      brakiMagEntry: entry.quantity > 1e-9 ? { ...entry } : null,
    }),
  );
};
