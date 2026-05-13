// Mock Role Service

import { defineTable, replaceArray, clone } from './_mockDb';

const MOCK_DELAY = 500;

const mockRoles = defineTable('roles', [
  { id: 1, name: 'Administrator' },
  { id: 2, name: 'Operator' },
  { id: 3, name: 'SalesManager' },
  { id: 5, name: 'Guest' },
]);

/**
 * Прибираємо легасі-роль "User" з персистнутого довідника ролей. Залишати її
 * у селекті немає сенсу: жодний маршрут її більше не вимагає, а адміна вона лише
 * плутає (виглядає як «звичайний користувач», але доступу не дає).
 */
if (mockRoles.some((r) => String(r.name).toLowerCase() === 'user')) {
  replaceArray(
    mockRoles,
    mockRoles.filter((r) => String(r.name).toLowerCase() !== 'user'),
  );
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class MockRoleService {
  static setAuthorizationToken(token) {
    console.log('[MOCK] Setting auth token for RoleService');
  }

  static async getRoles() {
    await delay(MOCK_DELAY);
    return clone(mockRoles);
  }
}


