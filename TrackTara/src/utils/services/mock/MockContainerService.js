// Mock Container Service - імітує роботу ContainerService з мок-даними

const MOCK_DELAY = 500;

// Мок-дані контейнерів
let mockContainers = [
  {
    id: 1,
    uniqueCode: 'A01-CNT-001', // Формат: СЕКТОР-РЯД-CNT-НОМЕР
    name: 'Контейнер для молока',
    typeId: 1,
    volume: 50,
    unitType: 'liters', // 'liters', 'kilograms', 'pieces'
    isEmpty: false,
    productId: 1,
    currentQuantity: 35, // Поточна кількість продукту в контейнері
    notes: 'Пластиковий контейнер',
    rowNumber: 1, // Ряд, в якому знаходиться тара
    sector: 'A', // Сектор складу
  },
  {
    id: 2,
    uniqueCode: 'A01-CNT-002',
    name: 'Контейнер для хліба',
    typeId: 2,
    volume: 30,
    unitType: 'pieces', // Хліб вимірюється в штуках
    isEmpty: true,
    productId: null,
    currentQuantity: 0, // Порожній контейнер
    notes: 'Металевий контейнер',
    rowNumber: 1,
    sector: 'A',
  },
  {
    id: 3,
    uniqueCode: 'B02-CNT-003',
    name: 'Контейнер для яєць',
    typeId: 3,
    volume: 20,
    unitType: 'pieces', // 'liters', 'kilograms', 'pieces'
    isEmpty: false,
    productId: 3,
    currentQuantity: 20, // Повний контейнер
    notes: 'Картонний контейнер',
    rowNumber: 2,
    sector: 'B',
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

