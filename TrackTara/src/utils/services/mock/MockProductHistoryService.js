// Mock Product History Service - імітує роботу ProductHistoryService з мок-даними

const MOCK_DELAY = 300;

// Мок-дані історії продуктів
// Кожен запис містить інформацію про дії з продуктом (створення, оновлення, покладення в тару, вийняття з тари)
let mockProductHistories = [
  {
    id: 1,
    productId: 1,
    containerId: 1,
    action: 'placed_in_container', // 'created', 'updated', 'placed_in_container', 'removed_from_container'
    date: '2024-01-15T10:30:00',
    userLogin: 'operator@test.com',
    description: 'Продукт покладено в контейнер A01-CNT-001',
  },
  {
    id: 2,
    productId: 1,
    containerId: null,
    action: 'created',
    date: '2024-01-15T09:00:00',
    userLogin: 'operator@test.com',
    description: 'Продукт створено',
  },
  {
    id: 3,
    productId: 2,
    containerId: null,
    action: 'created',
    date: '2024-01-16T08:15:00',
    userLogin: 'admin@test.com',
    description: 'Продукт створено',
  },
  {
    id: 4,
    productId: 2,
    containerId: 2,
    action: 'placed_in_container',
    date: '2024-01-12T14:25:00',
    userLogin: 'operator@test.com',
    description: 'Продукт покладено в контейнер A01-CNT-002',
  },
  {
    id: 5,
    productId: 2,
    containerId: 2,
    action: 'removed_from_container',
    date: '2024-01-14T16:45:00',
    userLogin: 'operator@test.com',
    description: 'Продукт вийнято з контейнера A01-CNT-002',
  },
  {
    id: 6,
    productId: 3,
    containerId: null,
    action: 'created',
    date: '2024-01-14T08:00:00',
    userLogin: 'operator@test.com',
    description: 'Продукт створено',
  },
  {
    id: 7,
    productId: 3,
    containerId: 3,
    action: 'placed_in_container',
    date: '2024-01-14T09:15:00',
    userLogin: 'operator@test.com',
    description: 'Продукт покладено в контейнер B02-CNT-003',
  },
  {
    id: 8,
    productId: 1,
    containerId: null,
    action: 'updated',
    date: '2024-01-20T11:20:00',
    userLogin: 'admin@test.com',
    description: 'Інформацію про продукт оновлено',
  },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllProductHistories = async (productId) => {
  await delay(MOCK_DELAY);
  // Фільтруємо історію для конкретного продукта
  const histories = mockProductHistories.filter(h => h.productId === parseInt(productId));
  // Сортуємо за датою (найновіші спочатку)
  return histories.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getProductHistoryById = async (productHistoryId) => {
  await delay(MOCK_DELAY);
  const history = mockProductHistories.find(h => h.id === parseInt(productHistoryId));
  if (!history) {
    throw {
      response: {
        data: 'Product history not found',
        status: 404,
      },
    };
  }
  return history;
};

// Функція для додавання нового запису в історію (викликається з MockProductService)
export const addProductHistory = async (productId, action, userLogin, containerId = null, description = '') => {
  await delay(MOCK_DELAY);
  const newId = Math.max(...mockProductHistories.map(h => h.id), 0) + 1;
  
  const newHistory = {
    id: newId,
    productId: parseInt(productId),
    containerId: containerId ? parseInt(containerId) : null,
    action,
    date: new Date().toISOString(),
    userLogin: userLogin || 'unknown@test.com',
    description: description || getDefaultDescription(action, containerId),
  };
  
  mockProductHistories.push(newHistory);
  return newHistory;
};

// Допоміжна функція для генерації опису за замовчуванням
const getDefaultDescription = (action, containerId) => {
  const actionDescriptions = {
    'created': 'Продукт створено',
    'updated': 'Інформацію про продукт оновлено',
    'placed_in_container': containerId ? `Продукт покладено в контейнер` : 'Продукт покладено в контейнер',
    'removed_from_container': containerId ? `Продукт вийнято з контейнера` : 'Продукт вийнято з контейнера',
  };
  return actionDescriptions[action] || 'Дія виконана';
};

// Експортуємо дані для доступу з інших модулів
export { mockProductHistories };

