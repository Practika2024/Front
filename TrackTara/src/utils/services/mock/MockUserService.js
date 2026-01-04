// Mock User Service - імітує роботу UserService з мок-даними

const MOCK_DELAY = 500;

// Мок-дані користувачів (зберігаються в пам'яті)
let mockUsers = [
  {
    id: 1,
    email: 'operator@test.com',
    name: 'Operator User',
    role: ['Operator'],
    image: 'N/A',
    favoriteProducts: [1, 2],
  },
  {
    id: 2,
    email: 'admin@test.com',
    name: 'Admin User',
    role: ['Administrator'],
    image: 'N/A',
    favoriteProducts: [],
  },
  {
    id: 3,
    email: 'user@test.com',
    name: 'Test User',
    role: ['Operator'],
    image: 'N/A',
    favoriteProducts: [1],
  },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class MockUserService {
  static setAuthorizationToken(token) {
    console.log('[MOCK] Setting auth token for UserService');
  }

  static async getUsers() {
    await delay(MOCK_DELAY);
    return mockUsers.map(({ favoriteProducts, ...user }) => user);
  }

  static async delete(userId) {
    await delay(MOCK_DELAY);
    mockUsers = mockUsers.filter(u => u.id !== userId);
    return { success: true };
  }

  static async changeRoles(userId, roles) {
    await delay(MOCK_DELAY);
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = Array.isArray(roles) ? roles : [roles];
    }
    return { success: true };
  }

  static async uploadImage(userId, file) {
    await delay(MOCK_DELAY * 2); // Більша затримка для завантаження
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.image = `mock-image-${userId}.jpg`;
    }

    // Генерація нових токенів (як у реальному API)
    const accessToken = btoa(JSON.stringify({ id: userId, ...user }));
    const refreshToken = btoa(JSON.stringify({ id: userId, type: 'refresh' }));

    return {
      accessToken,
      refreshToken,
    };
  }

  static async updateUser(userId, model) {
    await delay(MOCK_DELAY);
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      Object.assign(user, model);
    }

    const accessToken = btoa(JSON.stringify({ id: userId, ...user }));
    const refreshToken = btoa(JSON.stringify({ id: userId, type: 'refresh' }));

    return {
      accessToken,
      refreshToken,
    };
  }

  static async getFavoriteProducts(userId) {
    await delay(MOCK_DELAY);
    const user = mockUsers.find(u => u.id === userId);
    return user?.favoriteProducts || [];
  }

  static async addFavoriteProduct(userId, productId) {
    await delay(MOCK_DELAY);
    const user = mockUsers.find(u => u.id === userId);
    if (user && !user.favoriteProducts.includes(productId)) {
      user.favoriteProducts.push(productId);
    }
    return { success: true };
  }

  static async removeFavoriteProduct(userId, productId) {
    await delay(MOCK_DELAY);
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.favoriteProducts = user.favoriteProducts.filter(id => id !== productId);
    }
    return { success: true };
  }

  static async createUser(model) {
    await delay(MOCK_DELAY);

    // Перевірка на дублікат
    const existingUser = mockUsers.find(u => u.email === model.email);
    if (existingUser) {
      throw {
        response: {
          data: 'User already exists',
          status: 409,
        },
      };
    }

    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      email: model.email,
      name: model.name || model.email.split('@')[0],
      role: model.roles || ['Operator'],
      image: 'N/A',
      favoriteProducts: [],
    };

    mockUsers.push(newUser);
    return { success: true, id: newUser.id };
  }
}

