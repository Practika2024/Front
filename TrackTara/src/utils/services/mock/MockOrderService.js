// Mock Order Service - імітує роботу OrderService з мок-даними

const MOCK_DELAY = 300;

// Мок-дані замовлень
// Замовлення містить список продуктів, які потрібно вийняти з контейнерів
let mockOrders = [
  {
    id: 1,
    sector: 'A',
    status: 'active', // 'active', 'completed', 'cancelled'
    createdAt: '2024-01-20T10:00:00',
    createdBy: 'admin@test.com',
    issueLineCode: null, // Лінія видання для замовлення
    carts: [], // Візки з товарами: [{ cartNumber, items: [{ itemId, containerCode, quantity }] }]
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Молоко 3.2%',
        containerId: 1,
        containerCode: 'A01-CNT-001',
        rowNumber: 1,
        productCode: 'PRD-001',
        quantity: 35, // Кількість для вийняття
        unitType: 'liters', // Тип одиниць вимірювання
        status: 'pending', // 'pending', 'in_progress', 'completed'
        pickedQuantity: 0, // Скільки вже вийнято
        pickedBy: null,
        pickedAt: null,
        issueLineCode: null, // Код лінії видання
      },
    ],
  },
  {
    id: 2,
    sector: 'B',
    status: 'active',
    createdAt: '2024-01-20T11:00:00',
    createdBy: 'admin@test.com',
    issueLineCode: null, // Лінія видання для замовлення
    carts: [], // Візки з товарами
    items: [
      {
        id: 1,
        productId: 3,
        productName: 'Яйця курячі',
        containerId: 3,
        containerCode: 'B02-CNT-003',
        rowNumber: 2,
        productCode: 'PRD-003',
        quantity: 20,
        unitType: 'pieces', // Тип одиниць вимірювання
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
      issueLineCode: null, // Лінія видання для замовлення
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
};

// Експортуємо дані для доступу з інших модулів
export { mockOrders };

