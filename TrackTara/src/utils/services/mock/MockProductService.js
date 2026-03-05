// Mock Product Service - імітує роботу ProductService з мок-даними

const MOCK_DELAY = 500;

// Мок-дані продуктів (експортуємо для доступу з інших модулів)
export let mockProducts = [
  {
    id: 1,
    name: 'Молоко 3.2%',
    description: 'Свіже коров\'яче молоко',
    manufactureDate: '2024-01-15T00:00:00',
    typeId: 1,
    typeName: 'Молочні продукти',
    containerNumber: 'A01-CNT-001',
    rowNumber: 1,
  },
  {
    id: 2,
    name: 'Хліб білий',
    description: 'Свіжий білий хліб',
    manufactureDate: '2024-01-16T00:00:00',
    typeId: 2,
    typeName: 'Хлібобулочні вироби',
    containerNumber: 'A01-CNT-002',
    rowNumber: 1,
  },
  {
    id: 3,
    name: 'Яйця курячі',
    description: 'Яйця категорії А',
    manufactureDate: '2024-01-14T00:00:00',
    typeId: 3,
    typeName: 'Яйця',
    containerNumber: 'B01-CNT-007',
    rowNumber: 1,
  },
  {
    id: 4,
    name: 'Кефір 2.5%',
    description: 'Свіжий кефір',
    manufactureDate: '2024-01-17T00:00:00',
    typeId: 1,
    typeName: 'Молочні продукти',
    containerNumber: 'A02-CNT-003',
    rowNumber: 2,
  },
  {
    id: 5,
    name: 'Сир твердий',
    description: 'Сир твердий 45%',
    manufactureDate: '2024-01-16T00:00:00',
    typeId: 2,
    typeName: 'Молочні продукти',
    containerNumber: 'A02-CNT-004',
    rowNumber: 2,
  },
  {
    id: 6,
    name: 'Масло вершкове',
    description: 'Масло вершкове 82.5%',
    manufactureDate: '2024-01-18T00:00:00',
    typeId: 2,
    typeName: 'Молочні продукти',
    containerNumber: 'A03-CNT-005',
    rowNumber: 3,
  },
  {
    id: 7,
    name: 'М\'ясо свиняче',
    description: 'Свіже м\'ясо свиняче',
    manufactureDate: '2024-01-19T00:00:00',
    typeId: 2,
    typeName: 'М\'ясо',
    containerNumber: 'B02-CNT-009',
    rowNumber: 2,
  },
  {
    id: 8,
    name: 'Риба морська',
    description: 'Свіжа риба морська',
    manufactureDate: '2024-01-18T00:00:00',
    typeId: 2,
    typeName: 'Риба',
    containerNumber: 'B02-CNT-010',
    rowNumber: 2,
  },
  {
    id: 9,
    name: 'Овочі свіжі',
    description: 'Набір свіжих овочів',
    manufactureDate: '2024-01-20T00:00:00',
    typeId: 2,
    typeName: 'Овочі',
    containerNumber: 'B03-CNT-011',
    rowNumber: 3,
  },
  {
    id: 10,
    name: 'Фрукти свіжі',
    description: 'Набір свіжих фруктів',
    manufactureDate: '2024-01-19T00:00:00',
    typeId: 2,
    typeName: 'Фрукти',
    containerNumber: 'C01-CNT-012',
    rowNumber: 1,
  },
  {
    id: 11,
    name: 'Сік яблучний',
    description: 'Свіжий сік яблучний',
    manufactureDate: '2024-01-17T00:00:00',
    typeId: 1,
    typeName: 'Напої',
    containerNumber: 'C01-CNT-013',
    rowNumber: 1,
  },
  {
    id: 12,
    name: 'Вода мінеральна',
    description: 'Вода мінеральна газована',
    manufactureDate: '2024-01-20T00:00:00',
    typeId: 1,
    typeName: 'Напої',
    containerNumber: 'C02-CNT-014',
    rowNumber: 2,
  },
  {
    id: 13,
    name: 'Крупа гречана',
    description: 'Крупа гречана високого ґатунку',
    manufactureDate: '2024-01-15T00:00:00',
    typeId: 2,
    typeName: 'Крупи',
    containerNumber: 'C02-CNT-015',
    rowNumber: 2,
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

export const MockProductService = {
  getAll: async () => {
    await delay(MOCK_DELAY);
    return [...mockProducts];
  },

  getById: async (id) => {
    await delay(MOCK_DELAY);
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
      throw {
        response: {
          data: 'Product not found',
          status: 404,
        },
      };
    }
    return product;
  },

  addProduct: async (product) => {
    await delay(MOCK_DELAY);
    const newProduct = {
      id: Math.max(...mockProducts.map(p => p.id), 0) + 1,
      ...product,
      manufactureDate: product.manufactureDate || new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    
    // Записуємо в історію продукта
    const userLogin = getUserLoginFromToken();
    const { addProductHistory } = await import('./MockProductHistoryService');
    await addProductHistory(newProduct.id, 'created', userLogin, null, 'Продукт створено');
    
    return newProduct;
  },

  updateProduct: async (id, product) => {
    await delay(MOCK_DELAY);
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw {
        response: {
          data: 'Product not found',
          status: 404,
        },
      };
    }
    const updatedProduct = {
      ...mockProducts[index],
      ...product,
      id: mockProducts[index].id, // Зберігаємо оригінальний ID
    };
    mockProducts[index] = updatedProduct;
    
    // Записуємо в історію продукта
    const userLogin = getUserLoginFromToken();
    const { addProductHistory } = await import('./MockProductHistoryService');
    await addProductHistory(id, 'updated', userLogin, null, 'Інформацію про продукт оновлено');
    
    return updatedProduct;
  },

  deleteProduct: async (id) => {
    await delay(MOCK_DELAY);
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw {
        response: {
          data: 'Product not found',
          status: 404,
        },
      };
    }
    const deleted = mockProducts[index];
    mockProducts.splice(index, 1);
    return deleted;
  },
};

