// Mock Auth Service - імітує роботу AuthService з мок-даними

const MOCK_DELAY = 500;

// Мок-користувачі для тестування
const MOCK_USERS = [
  {
    id: 1,
    email: 'operator@test.com',
    password: 'password123',
    name: 'Operator User',
    role: 'Operator',
    image: 'N/A',
  },
  {
    id: 2,
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin User',
    role: 'Administrator',
    image: 'N/A',
  },
];

// Генерація JWT токенів у валідному форматі (header.payload.signature)
// jwt-decode очікує формат з 3 частинами розділеними крапками
const generateMockToken = (user) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 година
    iat: Math.floor(Date.now() / 1000),
  };
  
  // Кодуємо header та payload в base64
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // Створюємо підпис (спрощений - просто "mock_signature")
  const signature = btoa('mock_signature').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // Повертаємо валідний JWT формат: header.payload.signature
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAuthService {
  static setAuthorizationToken(token) {
    // Моки не потребують реального токену
    console.log('[MOCK] Setting auth token:', token ? 'Token set' : 'Token cleared');
  }

  static async signIn(model) {
    await delay(MOCK_DELAY);
    
    const user = MOCK_USERS.find(
      u => u.email === model.email && u.password === model.password
    );

    if (!user) {
      throw {
        response: {
          data: 'Invalid email or password',
          status: 401,
        },
      };
    }

    const accessToken = generateMockToken(user);
    const refreshToken = generateMockToken({ ...user, type: 'refresh' });

    return {
      accessToken,
      refreshToken,
    };
  }

  static async externalLogin(model) {
    await delay(MOCK_DELAY);
    
    // Мок для Google OAuth
    // Якщо передано Google токен, спробуємо декодувати його (або створимо нового користувача)
    let user;
    
    if (model.token && model.provider === 'Google') {
      // Для моків створюємо користувача на основі Google токену
      // В реальному API тут був би запит до бекенду для валідації токену
      try {
        // Спроба декодувати Google JWT токен (якщо він валідний)
        const parts = model.token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          user = {
            id: MOCK_USERS.length + 1,
            email: payload.email || 'google@test.com',
            name: payload.name || payload.given_name || 'Google User',
            role: 'Operator',
            image: payload.picture || 'N/A',
          };
        } else {
          throw new Error('Invalid token format');
        }
      } catch (error) {
        // Якщо не вдалося декодувати, створюємо дефолтного користувача
        user = {
          id: MOCK_USERS.length + 1,
          email: 'google@test.com',
          name: 'Google User',
          role: 'Operator',
          image: 'N/A',
        };
      }
    } else {
      // Fallback для інших провайдерів або якщо передано email/name напряму
      user = {
        id: MOCK_USERS.length + 1,
        email: model.email || 'external@test.com',
        name: model.name || 'External User',
        role: 'Operator',
        image: model.image || 'N/A',
      };
    }

    // Перевірка чи користувач вже існує
    let existingUser = MOCK_USERS.find(u => u.email === user.email);
    if (!existingUser) {
      MOCK_USERS.push(user);
      existingUser = user;
    }

    const accessToken = generateMockToken(existingUser);
    const refreshToken = generateMockToken({ ...existingUser, type: 'refresh' });

    return {
      accessToken,
      refreshToken,
    };
  }

  static async signUp(model) {
    await delay(MOCK_DELAY);

    // Перевірка чи користувач вже існує
    const existingUser = MOCK_USERS.find(u => u.email === model.email);
    if (existingUser) {
      throw {
        response: {
          data: 'User already exists',
          status: 409,
        },
      };
    }

    const newUser = {
      id: MOCK_USERS.length + 1,
      email: model.email,
      password: model.password,
      name: model.name || model.email.split('@')[0],
      role: 'Operator',
      image: 'N/A',
    };

    MOCK_USERS.push(newUser);

    const accessToken = generateMockToken(newUser);
    const refreshToken = generateMockToken({ ...newUser, type: 'refresh' });

    return {
      accessToken,
      refreshToken,
      message: 'User created successfully',
    };
  }

  static async refreshToken(model) {
    await delay(MOCK_DELAY);
    
    try {
      // Декодуємо JWT токен (формат: header.payload.signature)
      const parts = model.accessToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Декодуємо payload (друга частина)
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const user = MOCK_USERS.find(u => u.id === payload.id);

      if (!user) {
        throw new Error('Invalid token');
      }

      const newAccessToken = generateMockToken(user);
      const newRefreshToken = generateMockToken({ ...user, type: 'refresh' });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw {
        response: {
          data: 'Invalid refresh token',
          status: 401,
        },
      };
    }
  }
}

