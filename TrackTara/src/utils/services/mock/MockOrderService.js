// Mock Order Service - імітує роботу OrderService з мок-даними

const MOCK_DELAY = 300;

// Мок-дані замовлень
// Замовлення містить список продуктів, які потрібно вийняти з контейнерів
let mockOrders = [
  {
    id: 1,
    sector: 'A',
    status: 'active',
    createdAt: '2024-01-20T10:00:00',
    createdBy: 'admin@test.com',
    issueLineCode: 'LINE-001',
    carts: [],
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Молоко 3.2%',
        containerId: 1,
        containerCode: 'A01-CNT-001',
        rowNumber: 1,
        productCode: 'PRD-001',
        quantity: 35,
        unitType: 'liters',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 2,
        productId: 2,
        productName: 'Хліб білий',
        containerId: 2,
        containerCode: 'A01-CNT-002',
        rowNumber: 1,
        productCode: 'PRD-002',
        quantity: 25,
        unitType: 'pieces',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 3,
        productId: 4,
        productName: 'Кефір 2.5%',
        containerId: 3,
        containerCode: 'A02-CNT-003',
        rowNumber: 2,
        productCode: 'PRD-004',
        quantity: 40,
        unitType: 'liters',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
    ],
  },
  {
    id: 2,
    sector: 'B',
    status: 'active',
    createdAt: '2024-01-20T11:00:00',
    createdBy: 'admin@test.com',
    issueLineCode: 'LINE-002',
    carts: [],
    items: [
      {
        id: 1,
        productId: 3,
        productName: 'Яйця курячі',
        containerId: 7,
        containerCode: 'B01-CNT-007',
        rowNumber: 1,
        productCode: 'PRD-003',
        quantity: 20,
        unitType: 'pieces',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 2,
        productId: 7,
        productName: 'М\'ясо свиняче',
        containerId: 9,
        containerCode: 'B02-CNT-009',
        rowNumber: 2,
        productCode: 'PRD-007',
        quantity: 30,
        unitType: 'kilograms',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 3,
        productId: 8,
        productName: 'Риба морська',
        containerId: 10,
        containerCode: 'B02-CNT-010',
        rowNumber: 2,
        productCode: 'PRD-008',
        quantity: 20,
        unitType: 'kilograms',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
    ],
  },
  {
    id: 3,
    sector: 'A',
    status: 'active',
    createdAt: '2024-01-20T12:00:00',
    createdBy: 'admin@test.com',
    issueLineCode: 'LINE-003',
    carts: [],
    items: [
      {
        id: 1,
        productId: 5,
        productName: 'Сир твердий',
        containerId: 4,
        containerCode: 'A02-CNT-004',
        rowNumber: 2,
        productCode: 'PRD-005',
        quantity: 15,
        unitType: 'kilograms',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 2,
        productId: 6,
        productName: 'Масло вершкове',
        containerId: 5,
        containerCode: 'A03-CNT-005',
        rowNumber: 3,
        productCode: 'PRD-006',
        quantity: 10,
        unitType: 'kilograms',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
    ],
  },
  {
    id: 4,
    sector: 'C',
    status: 'active',
    createdAt: '2024-01-20T13:00:00',
    createdBy: 'admin@test.com',
    issueLineCode: 'LINE-004',
    carts: [],
    items: [
      {
        id: 1,
        productId: 10,
        productName: 'Фрукти свіжі',
        containerId: 12,
        containerCode: 'C01-CNT-012',
        rowNumber: 1,
        productCode: 'PRD-010',
        quantity: 25,
        unitType: 'kilograms',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 2,
        productId: 11,
        productName: 'Сік яблучний',
        containerId: 13,
        containerCode: 'C01-CNT-013',
        rowNumber: 1,
        productCode: 'PRD-011',
        quantity: 40,
        unitType: 'liters',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 3,
        productId: 12,
        productName: 'Вода мінеральна',
        containerId: 14,
        containerCode: 'C02-CNT-014',
        rowNumber: 2,
        productCode: 'PRD-012',
        quantity: 60,
        unitType: 'liters',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
      {
        id: 4,
        productId: 13,
        productName: 'Крупа гречана',
        containerId: 15,
        containerCode: 'C02-CNT-015',
        rowNumber: 2,
        productCode: 'PRD-013',
        quantity: 30,
        unitType: 'kilograms',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
    ],
  },
  {
    id: 5,
    sector: 'B',
    status: 'in_progress',
    createdAt: '2024-01-20T09:00:00',
    createdBy: 'admin@test.com',
    issueLineCode: 'LINE-005',
    carts: [
      {
        cartNumber: 'A123',
        items: [
          { itemId: 1, containerCode: 'B01-CNT-008', quantity: 10 },
        ],
        leftOnLine: false,
        issueLineCode: null,
      },
    ],
    items: [
      {
        id: 1,
        productId: 3,
        productName: 'Яйця курячі',
        containerId: 8,
        containerCode: 'B01-CNT-008',
        rowNumber: 1,
        productCode: 'PRD-003',
        quantity: 15,
        unitType: 'pieces',
        status: 'in_progress',
        pickedQuantity: 10,
        pickedBy: 'operator@test.com',
        pickedAt: '2024-01-20T09:30:00',
        issueLineCode: null,
      },
      {
        id: 2,
        productId: 9,
        productName: 'Овочі свіжі',
        containerId: 11,
        containerCode: 'B03-CNT-011',
        rowNumber: 3,
        productCode: 'PRD-009',
        quantity: 30,
        unitType: 'kilograms',
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      },
    ],
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

export const OrderService = {
  // Отримати всі замовлення
  getAllOrders: async () => {
    await delay(MOCK_DELAY);
    return JSON.parse(JSON.stringify(mockOrders));
  },

  // Отримати замовлення за ID
  getOrderById: async (orderId) => {
    await delay(MOCK_DELAY);
    const order = mockOrders.find(o => o.id === parseInt(orderId));
    if (!order) {
      throw {
        response: {
          data: 'Order not found',
          status: 404,
        },
      };
    }
    return JSON.parse(JSON.stringify(order));
  },

  // Отримати замовлення за сектором
  getOrdersBySector: async (sector) => {
    await delay(MOCK_DELAY);
    const orders = mockOrders.filter(o => 
      o.sector.toUpperCase() === sector.toUpperCase() && o.status === 'active'
    );
    return JSON.parse(JSON.stringify(orders));
  },

  // Створити нове замовлення
  createOrder: async (orderData) => {
    await delay(MOCK_DELAY);
    const newId = Math.max(...mockOrders.map(o => o.id), 0) + 1;
    const userLogin = getUserLoginFromToken();
    
    const newOrder = {
      id: newId,
      sector: orderData.sector.toUpperCase(),
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: userLogin,
      issueLineCode: orderData.issueLineCode || null, // Лінія видання для замовлення
      carts: [], // Візки з товарами
      items: orderData.items.map((item, index) => ({
        id: index + 1,
        productId: item.productId,
        productName: item.productName,
        containerId: item.containerId,
        containerCode: item.containerCode,
        rowNumber: item.rowNumber,
        productCode: item.productCode,
        quantity: item.quantity,
        unitType: item.unitType || 'liters', // Тип одиниць вимірювання
        status: 'pending',
        pickedQuantity: 0,
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null,
      })),
    };
    
    mockOrders.push(newOrder);
    return JSON.parse(JSON.stringify(newOrder));
  },

  // Оновити статус замовлення
  updateOrderStatus: async (orderId, status) => {
    await delay(MOCK_DELAY);
    const order = mockOrders.find(o => o.id === parseInt(orderId));
    if (!order) {
      throw {
        response: {
          data: 'Order not found',
          status: 404,
        },
      };
    }
    order.status = status;
    return JSON.parse(JSON.stringify(order));
  },

  // Відмітити продукт як вийнятий
  pickProduct: async (orderId, itemId, productCode, containerCode, issueLineCode, cartNumber) => {
    await delay(MOCK_DELAY);
    const order = mockOrders.find(o => o.id === parseInt(orderId));
    if (!order) {
      throw {
        response: {
          data: 'Order not found',
          status: 404,
        },
      };
    }
    
    const item = order.items.find(i => i.id === parseInt(itemId));
    if (!item) {
      throw {
        response: {
          data: 'Order item not found',
          status: 404,
        },
      };
    }

    // Перевірка коду продукту
    if (item.productCode !== productCode) {
      throw {
        response: {
          data: `Код продукту не співпадає. Очікується: ${item.productCode}`,
          status: 400,
        },
      };
    }

    // Перевірка коду контейнера
    if (item.containerCode !== containerCode) {
      throw {
        response: {
          data: `Код контейнера не співпадає. Очікується: ${item.containerCode}`,
          status: 400,
        },
      };
    }

    // Оновлюємо статус
    const userLogin = getUserLoginFromToken();
    item.pickedQuantity = item.quantity;
    item.status = 'completed';
    item.pickedBy = userLogin;
    item.pickedAt = new Date().toISOString();
    item.issueLineCode = issueLineCode;

    // Додаємо товар до візка
    if (cartNumber) {
      let cart = order.carts.find(c => c.cartNumber === cartNumber && !c.leftOnLine);
      if (!cart) {
        cart = {
          cartNumber: cartNumber,
          items: [],
          leftOnLine: false // Чи залишений візок на лінії видання
        };
        order.carts.push(cart);
      }
      cart.items.push({
        itemId: item.id,
        containerCode: containerCode,
        quantity: item.quantity
      });
      
      // Після повного вийняття товару візок залишається на лінії видання
      if (issueLineCode) {
        cart.leftOnLine = true;
        cart.issueLineCode = issueLineCode;
      }
    }

    // Встановлюємо лінію видання для замовлення (якщо всі товари вийняті)
    if (issueLineCode) {
      const allCompleted = order.items.every(i => i.status === 'completed');
      if (allCompleted) {
        order.issueLineCode = issueLineCode;
      }
    }

    // Перевіряємо, чи всі продукти вийняті
    const allCompleted = order.items.every(i => i.status === 'completed');
    if (allCompleted) {
      order.status = 'completed';
    }

    // Оновлюємо контейнер - виймаємо продукт
    try {
      const { clearProductFromTare } = await import('./MockContainerService');
      await clearProductFromTare(item.containerId, item.quantity);
    } catch (error) {
      console.error('Error updating container:', error);
      // Не викидаємо помилку, оскільки замовлення вже оновлено
    }

    return JSON.parse(JSON.stringify(order));
  },

  // Часткове вийняття продукту (без коду лінії видання)
  pickProductPartial: async (orderId, itemId, productCode, containerCode, quantity, cartNumber, needNewCart = false) => {
    await delay(MOCK_DELAY);
    const order = mockOrders.find(o => o.id === parseInt(orderId));
    if (!order) {
      throw {
        response: {
          data: 'Order not found',
          status: 404,
        },
      };
    }
    
    const item = order.items.find(i => i.id === parseInt(itemId));
    if (!item) {
      throw {
        response: {
          data: 'Order item not found',
          status: 404,
        },
      };
    }

    // Перевірка коду продукту
    if (item.productCode !== productCode) {
      throw {
        response: {
          data: `Код продукту не співпадає. Очікується: ${item.productCode}`,
          status: 400,
        },
      };
    }

    // Перевірка коду контейнера
    if (item.containerCode !== containerCode) {
      throw {
        response: {
          data: `Код контейнера не співпадає. Очікується: ${item.containerCode}`,
          status: 400,
        },
      };
    }

    const quantityToPick = parseFloat(quantity);
    const remainingQuantity = item.quantity - (item.pickedQuantity || 0);

    // Перевірка кількості
    if (quantityToPick <= 0) {
      throw {
        response: {
          data: 'Кількість для вийняття повинна бути більше 0',
          status: 400,
        },
      };
    }

    if (quantityToPick > remainingQuantity) {
      throw {
        response: {
          data: `Кількість (${quantityToPick}) не може перевищувати залишок (${remainingQuantity})`,
          status: 400,
        },
      };
    }

    // Оновлюємо статус
    const userLogin = getUserLoginFromToken();
    item.pickedQuantity = (item.pickedQuantity || 0) + quantityToPick;
    // quantity залишається незмінною (це загальна кількість для вийняття)
    // pickedQuantity - скільки вже вийнято
    // Залишок = quantity - pickedQuantity
    const newRemainingQuantity = item.quantity - item.pickedQuantity;
    item.status = newRemainingQuantity <= 0 ? 'completed' : 'in_progress';
    
    if (!item.pickedBy) {
      item.pickedBy = userLogin;
      item.pickedAt = new Date().toISOString();
    }

    // Додаємо товар до візка
    if (cartNumber) {
      let cart = order.carts.find(c => c.cartNumber === cartNumber && !c.leftOnLine);
      if (!cart) {
        cart = {
          cartNumber: cartNumber,
          items: [],
          leftOnLine: false // Чи залишений візок на лінії видання
        };
        order.carts.push(cart);
      }
      cart.items.push({
        itemId: item.id,
        containerCode: containerCode,
        quantity: quantityToPick
      });
      
      // Якщо потрібен новий візок, позначаємо поточний як залишений на лінії
      if (needNewCart) {
        cart.leftOnLine = true;
      }
    }

    // Оновлюємо контейнер - виймаємо продукт частково
    try {
      const { clearProductFromTare } = await import('./MockContainerService');
      await clearProductFromTare(item.containerId, quantityToPick);
    } catch (error) {
      console.error('Error updating container:', error);
      // Не викидаємо помилку, оскільки замовлення вже оновлено
    }

    // Перевіряємо, чи всі продукти вийняті
    const allCompleted = order.items.every(i => i.status === 'completed');
    if (allCompleted) {
      order.status = 'completed';
    } else {
      order.status = 'active'; // Замовлення продовжується
    }

    return JSON.parse(JSON.stringify(order));
  },

  // Позначити візок як залишений на лінії
  markCartAsLeftOnLine: async (orderId, cartNumber, issueLineCode) => {
    await delay(MOCK_DELAY);
    const order = mockOrders.find(o => o.id === parseInt(orderId));
    if (!order) {
      throw {
        response: {
          data: 'Order not found',
          status: 404,
        },
      };
    }

    const cart = order.carts.find(c => c.cartNumber === cartNumber && !c.leftOnLine);
    if (cart) {
      cart.leftOnLine = true;
      cart.issueLineCode = issueLineCode || null;
    }

    return JSON.parse(JSON.stringify(order));
  },
};

// Експортуємо дані для доступу з інших модулів
export { mockOrders };

