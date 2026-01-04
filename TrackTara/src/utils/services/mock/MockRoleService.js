// Mock Role Service

const MOCK_DELAY = 500;

const mockRoles = [
  { id: 1, name: 'Administrator' },
  { id: 2, name: 'Operator' },
  { id: 3, name: 'User' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class MockRoleService {
  static setAuthorizationToken(token) {
    console.log('[MOCK] Setting auth token for RoleService');
  }

  static async getRoles() {
    await delay(MOCK_DELAY);
    return [...mockRoles];
  }
}

