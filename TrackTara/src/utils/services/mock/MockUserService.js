// Mock User Service - імітує роботу UserService з мок-даними

import { MockAuthService } from "./MockAuthService";
import { defineTable, replaceArray, clone } from './_mockDb';

const MOCK_DELAY = 500;

// Мок-дані користувачів (зберігаються в пам'яті)
const mockUsers = defineTable('users', [
  {
    id: 1,
    email: 'operator@test.com',
    name: 'Operator User',
    role: ['Operator'],
    image: 'N/A',
  },
  {
    id: 2,
    email: 'admin@test.com',
    name: 'Admin User',
    role: ['Administrator'],
    image: 'N/A',
  },
  {
    id: 3,
    email: 'user@test.com',
    name: 'Test User',
    role: ['Operator'],
    image: 'N/A',
  },
  {
    id: 4,
    email: 'sales@test.com',
    name: 'Менеджер з продажу',
    role: ['SalesManager'],
    image: 'N/A',
  },
  {
    id: 5,
    email: 'vetal05most@gmail.com',
    name: 'Новий користувач (очікує ролі)',
    role: ['Guest'],
    image: 'N/A',
  },
]);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class MockUserService {
  static setAuthorizationToken(token) {
    console.log('[MOCK] Setting auth token for UserService');
  }

  static async getUsers() {
    await delay(MOCK_DELAY);
    return clone(mockUsers);
  }

  static async delete(userId) {
    await delay(MOCK_DELAY);
    replaceArray(mockUsers, mockUsers.filter(u => u.id !== userId));
    return { success: true };
  }

  static async changeRoles(userId, roles) {
    await delay(MOCK_DELAY);
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = Array.isArray(roles) ? roles : [roles];
      MockAuthService.syncRoleForEmail(user.email, user.role);
    }
    return { success: true };
  }

  /** Адмін задає новий пароль працівнику (мок-логін за email з картки користувача). */
  static async adminResetPassword(userId, newPassword) {
    await delay(MOCK_DELAY);
    const mu = mockUsers.find((u) => Number(u.id) === Number(userId));
    if (!mu?.email) {
      throw {
        response: { status: 404, data: { message: "Користувача не знайдено" } },
      };
    }
    MockAuthService.adminSetPasswordForEmail(mu.email, newPassword);
    return { success: true, message: "Пароль оновлено" };
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
    };

    mockUsers.push(newUser);
    return { success: true, id: newUser.id };
  }
}

