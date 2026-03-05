// Mock Container Service - імітує роботу ContainerService з мок-даними

const MOCK_DELAY = 500;

// Мок-дані контейнерів
let mockContainers = [
  // Сектор A
  {
    id: 1,
    uniqueCode: 'A01-CNT-001',
    name: 'Контейнер для молока',
    typeId: 1,
    volume: 50,
    unitType: 'liters',
    isEmpty: false,
    productId: 1,
    currentQuantity: 35,
    notes: 'Пластиковий контейнер',
    rowNumber: 1,
    sector: 'A',
  },
  {
    id: 2,
    uniqueCode: 'A01-CNT-002',
    name: 'Контейнер для хліба',
    typeId: 2,
    volume: 30,
    unitType: 'pieces',
    isEmpty: false,
    productId: 2,
    currentQuantity: 25,
    notes: 'Металевий контейнер',
    rowNumber: 1,
    sector: 'A',
  },
  {
    id: 3,
    uniqueCode: 'A02-CNT-003',
    name: 'Контейнер для кефіру',
    typeId: 1,
    volume: 40,
    unitType: 'liters',
    isEmpty: false,
    productId: 4,
    currentQuantity: 40,
    notes: 'Пластиковий контейнер',
    rowNumber: 2,
    sector: 'A',
  },
  {
    id: 4,
    uniqueCode: 'A02-CNT-004',
    name: 'Контейнер для сиру',
    typeId: 2,
    volume: 25,
    unitType: 'kilograms',
    isEmpty: false,
    productId: 5,
    currentQuantity: 20,
    notes: 'Пластиковий контейнер',
    rowNumber: 2,
    sector: 'A',
  },
  {
    id: 5,
    uniqueCode: 'A03-CNT-005',
    name: 'Контейнер для масла',
    typeId: 2,
    volume: 15,
    unitType: 'kilograms',
    isEmpty: false,
    productId: 6,
    currentQuantity: 12,
    notes: 'Металевий контейнер',
    rowNumber: 3,
    sector: 'A',
  },
  {
    id: 6,
    uniqueCode: 'A03-CNT-006',
    name: 'Контейнер для сметани',
    typeId: 1,
    volume: 30,
    unitType: 'liters',
    isEmpty: true,
    productId: null,
    currentQuantity: 0,
    notes: 'Пластиковий контейнер',
    rowNumber: 3,
    sector: 'A',
  },
  // Сектор B
  {
    id: 7,
    uniqueCode: 'B01-CNT-007',
    name: 'Контейнер для яєць',
    typeId: 3,
    volume: 20,
    unitType: 'pieces',
    isEmpty: false,
    productId: 3,
    currentQuantity: 20,
    notes: 'Картонний контейнер',
    rowNumber: 1,
    sector: 'B',
  },
  {
    id: 8,
    uniqueCode: 'B01-CNT-008',
    name: 'Контейнер для яєць',
    typeId: 3,
    volume: 20,
    unitType: 'pieces',
    isEmpty: false,
    productId: 3,
    currentQuantity: 15,
    notes: 'Картонний контейнер',
    rowNumber: 1,
    sector: 'B',
  },
  {
    id: 9,
    uniqueCode: 'B02-CNT-009',
    name: 'Контейнер для м\'яса',
    typeId: 2,
    volume: 50,
    unitType: 'kilograms',
    isEmpty: false,
    productId: 7,
    currentQuantity: 45,
    notes: 'Металевий контейнер',
    rowNumber: 2,
    sector: 'B',
  },
  {
    id: 10,
    uniqueCode: 'B02-CNT-010',
    name: 'Контейнер для риби',
    typeId: 2,
    volume: 30,
    unitType: 'kilograms',
    isEmpty: false,
    productId: 8,
    currentQuantity: 25,
    notes: 'Пластиковий контейнер',
    rowNumber: 2,
    sector: 'B',
  },
  {
    id: 11,
    uniqueCode: 'B03-CNT-011',
    name: 'Контейнер для овочів',
    typeId: 2,
    volume: 40,
    unitType: 'kilograms',
    isEmpty: false,
    productId: 9,
    currentQuantity: 35,
    notes: 'Пластиковий контейнер',
    rowNumber: 3,
    sector: 'B',
  },
  // Сектор C
  {
    id: 12,
    uniqueCode: 'C01-CNT-012',
    name: 'Контейнер для фруктів',
    typeId: 2,
    volume: 35,
    unitType: 'kilograms',
    isEmpty: false,
    productId: 10,
    currentQuantity: 30,
    notes: 'Пластиковий контейнер',
    rowNumber: 1,
    sector: 'C',
  },
  {
    id: 13,
    uniqueCode: 'C01-CNT-013',
    name: 'Контейнер для соку',
    typeId: 1,
    volume: 60,
    unitType: 'liters',
    isEmpty: false,
    productId: 11,
    currentQuantity: 50,
    notes: 'Пластиковий контейнер',
    rowNumber: 1,
    sector: 'C',
  },
  {
    id: 14,
    uniqueCode: 'C02-CNT-014',
    name: 'Контейнер для води',
    typeId: 1,
    volume: 100,
    unitType: 'liters',
    isEmpty: false,
    productId: 12,
    currentQuantity: 80,
    notes: 'Пластиковий контейнер',
    rowNumber: 2,
    sector: 'C',
  },
  {
    id: 15,
    uniqueCode: 'C02-CNT-015',
    name: 'Контейнер для круп',
    typeId: 2,
    volume: 50,
    unitType: 'kilograms',
    isEmpty: false,
    productId: 13,
    currentQuantity: 40,
    notes: 'Пластиковий контейнер',
    rowNumber: 2,
    sector: 'C',
  },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Допоміжна функція для отримання логіну користувача з токену
const getUserLoginFromToken = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.email || 'unknown@test.com';
      }
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  return 'unknown@test.com';
};

export const createContainer = async (containerData) => {
  await delay(MOCK_DELAY);
  const newId = Math.max(...mockContainers.map(c => c.id), 0) + 1;
  const sector = containerData.sector || 'A'; // За замовчуванням сектор A
  const rowNumber = containerData.rowNumber || 1; // За замовчуванням ряд 1
  const formattedRowNumber = String(rowNumber).padStart(2, '0'); // Форматуємо ряд як 01, 02, тощо
  const formattedId = String(newId).padStart(3, '0'); // Форматуємо ID як 001, 002, тощо
  
  // Формат: СЕКТОР-РЯД-CNT-НОМЕР (наприклад: A01-CNT-001)
  const uniqueCode = `${sector}${formattedRowNumber}-CNT-${formattedId}`;
  
  const newContainer = {
    id: newId,
    uniqueCode,
    ...containerData,
    unitType: containerData.unitType || 'liters', // За замовчуванням літри
    isEmpty: true,
    productId: null,
    currentQuantity: 0, // Новий контейнер порожній
    rowNumber,
    sector,
  };
  mockContainers.push(newContainer);
  
  // Записуємо в історію контейнера (створення)
  const userLogin = getUserLoginFromToken();
  const { addContainerHistory } = await import('./MockContainerHistoryService');
  await addContainerHistory(newId, null, 'created', userLogin);
  
  return newContainer;
};

export const getAllContainers = async () => {
  await delay(MOCK_DELAY);
  return [...mockContainers];
};

export const getContainerById = async (id) => {
  await delay(MOCK_DELAY);
  const container = mockContainers.find(c => c.id === parseInt(id));
  if (!container) {
    throw {
      response: {
        data: 'Container not found',
        status: 404,
      },
    };
  }
  return container;
};

export const deleteContainer = async (id) => {
  await delay(MOCK_DELAY);
  const index = mockContainers.findIndex(c => c.id === parseInt(id));
  if (index === -1) {
    throw {
      response: {
        data: 'Container not found',
        status: 404,
      },
    };
  }
  mockContainers.splice(index, 1);
};

export const setProductToContainer = async (containerId, productId, quantity = null) => {
  await delay(MOCK_DELAY);
  const containerIndex = mockContainers.findIndex(c => c.id === parseInt(containerId));
  if (containerIndex === -1) {
    throw {
      response: {
        data: 'Container not found',
        status: 404,
      },
    };
  }
  
  // Створюємо копію об'єкта для зміни
  const container = { ...mockContainers[containerIndex] };
  const currentQuantity = container.currentQuantity || 0;
  const availableSpace = container.volume - currentQuantity;
  
  // Якщо контейнер вже містить інший продукт, забороняємо додавання
  if (container.productId && container.productId !== parseInt(productId)) {
    throw {
      response: {
        data: 'Контейнер вже містить інший продукт. Спочатку вийміть поточний продукт.',
        status: 400,
      },
    };
  }
  
  // Якщо контейнер повністю заповнений, забороняємо додавання
  if (availableSpace <= 0 && container.productId) {
    throw {
      response: {
        data: 'Контейнер повністю заповнений. Неможливо додати більше продукту.',
        status: 400,
      },
    };
  }
  
  // Якщо кількість не вказана, використовуємо доступне вільне місце
  const quantityToAdd = quantity !== null ? parseFloat(quantity) : availableSpace;
  
  // Перевірка: чи не перевищує кількість доступне вільне місце
  if (quantityToAdd > availableSpace) {
    const unitLabel = container.unitType === 'liters' ? 'л' : container.unitType === 'kilograms' ? 'кг' : 'шт';
    throw {
      response: {
        data: `Кількість (${quantityToAdd} ${unitLabel}) не може перевищувати доступне вільне місце (${availableSpace} ${unitLabel})`,
        status: 400,
      },
    };
  }
  
  // Якщо контейнер вже містить той самий продукт, додаємо до поточної кількості
  if (container.productId && container.productId === parseInt(productId)) {
    container.currentQuantity = currentQuantity + quantityToAdd;
  } else {
    // Новий продукт в порожньому контейнері
    container.productId = parseInt(productId);
    container.currentQuantity = quantityToAdd;
    container.isEmpty = false;
  }
  
  // Оновлюємо об'єкт в масиві
  mockContainers[containerIndex] = container;
  
  // Оновлюємо продукт - додаємо номер тари та автоматично витягуємо ряд з коду
  const { mockProducts } = await import('./MockProductService');
  const { parseContainerCode } = await import('../../helpers/containerCodeParser');
  const productIndex = mockProducts.findIndex(p => p.id === parseInt(productId));
  if (productIndex !== -1) {
    // Створюємо копію продукту для зміни
    const product = { ...mockProducts[productIndex] };
    product.containerNumber = container.uniqueCode;
    const parsed = parseContainerCode(container.uniqueCode);
    product.rowNumber = parsed ? parsed.rowNumber : null;
    // Оновлюємо продукт в масиві
    mockProducts[productIndex] = product;
  }
  
  // Записуємо в історію контейнера
  const userLogin = getUserLoginFromToken();
  const { addContainerHistory } = await import('./MockContainerHistoryService');
  await addContainerHistory(containerId, productId, 'placed', userLogin, quantityToAdd);
  
  // Записуємо в історію продукта
  const { addProductHistory } = await import('./MockProductHistoryService');
  await addProductHistory(productId, 'placed_in_container', userLogin, containerId, `Додано ${quantityToAdd} л/кг продукту в контейнер ${container.uniqueCode}`);
  
  return container;
};

export const updateContainer = async (id, containerData) => {
  await delay(MOCK_DELAY);
  const containerIndex = mockContainers.findIndex(c => c.id === parseInt(id));
  if (containerIndex === -1) {
    throw {
      response: {
        data: 'Container not found',
        status: 404,
      },
    };
  }
  
  // Створюємо копію об'єкта для зміни
  const container = { ...mockContainers[containerIndex], ...containerData };
  
  // Якщо змінився сектор або ряд, оновлюємо uniqueCode
  const sector = containerData.sector || container.sector || 'A';
  const rowNumber = containerData.rowNumber || container.rowNumber || 1;
  const formattedRowNumber = String(rowNumber).padStart(2, '0');
  const formattedId = String(container.id).padStart(3, '0');
  container.uniqueCode = `${sector}${formattedRowNumber}-CNT-${formattedId}`;
  container.sector = sector;
  container.rowNumber = rowNumber;
  
  // Оновлюємо об'єкт в масиві
  mockContainers[containerIndex] = container;
  
  return container;
};

export const clearProductFromTare = async (containerId, quantity = null) => {
  await delay(MOCK_DELAY);
  const containerIndex = mockContainers.findIndex(c => c.id === parseInt(containerId));
  if (containerIndex === -1 || !mockContainers[containerIndex].productId) {
    throw {
      response: {
        data: 'Container is empty or not found',
        status: 400,
      },
    };
  }
  
  // Створюємо копію об'єкта для зміни
  const container = { ...mockContainers[containerIndex] };
  const productId = container.productId;
  const currentQuantity = container.currentQuantity || 0;
  
  // Якщо кількість не вказана, виймаємо весь продукт
  const quantityToRemove = quantity !== null ? parseFloat(quantity) : currentQuantity;
  
  // Перевірка: чи не перевищує кількість поточну кількість
  if (quantityToRemove > currentQuantity) {
    throw {
      response: {
        data: `Кількість для вийняття (${quantityToRemove}) не може перевищувати поточну кількість (${currentQuantity})`,
        status: 400,
      },
    };
  }
  
  // Віднімаємо кількість
  container.currentQuantity = currentQuantity - quantityToRemove;
  
  // Якщо контейнер порожній, очищаємо продукт
  if (container.currentQuantity <= 0) {
    container.productId = null;
    container.isEmpty = true;
    container.currentQuantity = 0;
    
    // Очищаємо номер тари та ряд у продукту
    const { mockProducts } = await import('./MockProductService');
    const productIndex = mockProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      // Створюємо копію продукту для зміни
      const product = { ...mockProducts[productIndex] };
      product.containerNumber = null;
      product.rowNumber = null;
      // Оновлюємо продукт в масиві
      mockProducts[productIndex] = product;
    }
  }
  
  // Оновлюємо об'єкт в масиві
  mockContainers[containerIndex] = container;
  
  // Записуємо в історію контейнера
  const userLogin = getUserLoginFromToken();
  const { addContainerHistory } = await import('./MockContainerHistoryService');
  await addContainerHistory(containerId, productId, 'removed', userLogin, quantityToRemove);
  
  // Записуємо в історію продукта
  const { addProductHistory } = await import('./MockProductHistoryService');
  await addProductHistory(productId, 'removed_from_container', userLogin, containerId, `Вийнято ${quantityToRemove} л/кг продукту з контейнера ${container.uniqueCode}`);
  
  return container;
};

