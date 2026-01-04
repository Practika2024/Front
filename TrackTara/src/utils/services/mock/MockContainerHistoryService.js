// Mock Container History Service - імітує роботу ContainerHistoryService з мок-даними

const MOCK_DELAY = 300;

// Мок-дані історії контейнерів
// Кожен запис містить інформацію про те, коли продукт був покладений у контейнер або вийнятий з нього
let mockContainerHistories = [
  {
    id: 1,
    containerId: 1,
    productId: 1,
    startDate: '2024-01-15T10:30:00',
    endDate: null, // null означає, що продукт досі в контейнері
    userLogin: 'operator@test.com', // Логін користувача, який поклав продукт
    action: 'placed', // 'placed' - покладено, 'removed' - вийнято
    quantity: 35, // Кількість продукту (літри/кілограми)
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
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllContainerHistories = async (containerId) => {
  await delay(MOCK_DELAY);
  // Фільтруємо історію для конкретного контейнера
  const histories = mockContainerHistories.filter(h => h.containerId === parseInt(containerId));
  // Сортуємо за датою (найновіші спочатку)
  return histories.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
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
  return history;
};

// Функція для додавання нового запису в історію (викликається з MockContainerService)
export const addContainerHistory = async (containerId, productId, action, userLogin, quantity = null) => {
  await delay(MOCK_DELAY);
  const newId = Math.max(...mockContainerHistories.map(h => h.id), 0) + 1;
  
  // Якщо контейнер створено
  if (action === 'created') {
    const newHistory = {
      id: newId,
      containerId: parseInt(containerId),
      productId: null,
      startDate: new Date().toISOString(),
      endDate: null,
      userLogin: userLogin || 'unknown@test.com',
      action: 'created',
      quantity: 0,
    };
    mockContainerHistories.push(newHistory);
    return newHistory;
  }
  // Якщо продукт покладено, створюємо новий запис з startDate і без endDate
  else if (action === 'placed') {
    const newHistory = {
      id: newId,
      containerId: parseInt(containerId),
      productId: productId ? parseInt(productId) : null,
      startDate: new Date().toISOString(),
      endDate: null,
      userLogin: userLogin || 'unknown@test.com',
      action: 'placed',
      quantity: quantity || 0,
    };
    mockContainerHistories.push(newHistory);
    return newHistory;
  } 
  // Якщо продукт вийнято, знаходимо останній запис для цього контейнера і продукта і встановлюємо endDate
  else if (action === 'removed') {
    // Знаходимо останній активний запис (без endDate) для цього контейнера
    const activeHistory = mockContainerHistories
      .filter(h => h.containerId === parseInt(containerId) && h.endDate === null)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
    
    if (activeHistory) {
      activeHistory.endDate = new Date().toISOString();
      activeHistory.action = 'removed';
      activeHistory.userLogin = userLogin || activeHistory.userLogin;
      activeHistory.quantity = quantity !== null ? quantity : activeHistory.quantity;
      return activeHistory;
    }
  }
  
  return null;
};

// Експортуємо дані для доступу з інших модулів
export { mockContainerHistories };

