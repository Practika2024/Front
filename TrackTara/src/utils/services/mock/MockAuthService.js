// Mock Auth Service - імітує роботу AuthService з мок-даними

import { defineTable } from './_mockDb';

const MOCK_DELAY = 500;

/**
 * Звертаємось до тієї ж 'users' таблиці, що її реєструє MockUserService.
 * Викликаємо тільки з runtime-функцій (вже після завантаження всіх сервісів
 * у ServiceFactory) — інакше тут можна випадково перетерти seed порожнім масивом.
 */
const getUsersDirectory = () => defineTable('users', []);

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

/**
 * UTF-8-безпечні base64url (як у справжньому JWT). `btoa` приймає лише Latin-1,
 * тож для кирилиці потрібно спочатку кодувати в UTF-8 байти, інакше отримаємо
 * `InvalidCharacterError` або «закарлюки» при наступному декодуванні.
 */
const b64UrlEncodeJson = (obj) => {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary)
    .replace(/=+$/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

/**
 * Декодування base64url → об'єкт. Інтерпретує байти як UTF-8 — це лікує
 * «мояубейку» (UTF-8, прочитаний як Latin-1) при роботі з реальними Google JWT.
 */
const b64UrlDecodeJson = (b64Url) => {
  const b64 = String(b64Url || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(String(b64Url || '').length / 4) * 4, '=');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const json = new TextDecoder('utf-8').decode(bytes);
  return JSON.parse(json);
};

/**
 * Спроба полікувати UTF-8 рядок, який раніше зберегли як Latin-1
 * (типове «Ð» / «Ñ» на початку слів — ознака зіпсованої кирилиці).
 */
const repairMojibakeText = (str) => {
  if (typeof str !== 'string' || !/[ÐÑ][\u0080-\u00FF]/.test(str)) return str;
  try {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code > 0xff) return str; // вже не «бінарний» рядок — не чіпаємо
      bytes[i] = code;
    }
    const fixed = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return fixed && fixed.length ? fixed : str;
  } catch {
    return str;
  }
};

/**
 * Тримає auth-таблицю (логін/пароль) і довідник користувачів синхронізованими.
 * Викликається на кожне «створення» користувача — чи то self-register, чи Google, чи адмін.
 */
const syncUserDirectoryEntry = (user) => {
  const email = normalizeEmail(user.email);
  if (!email) return;
  const dir = getUsersDirectory();
  const existing = dir.find((u) => normalizeEmail(u.email) === email);
  const role = Array.isArray(user.role)
    ? [...user.role]
    : [user.role || 'Guest'];

  if (existing) {
    if (user.name && user.name !== existing.name) existing.name = user.name;
    if (user.image && user.image !== existing.image) existing.image = user.image;
    if (!Array.isArray(existing.role) || existing.role.length === 0) {
      existing.role = role;
    }
    return existing;
  }

  const nextId = dir.length
    ? Math.max(...dir.map((u) => Number(u.id) || 0)) + 1
    : Math.max(Number(user.id) || 0, 1);

  const entry = {
    id: nextId,
    email: user.email,
    name: user.name || user.email,
    role,
    image: user.image || 'N/A',
  };
  dir.push(entry);
  return entry;
};

// Мок-користувачі для тестування (включно з паролями для входу)
const MOCK_USERS = defineTable('authUsers', [
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
  {
    id: 3,
    email: 'sales@test.com',
    password: 'password123',
    name: 'Sales Manager',
    role: 'SalesManager',
    image: 'N/A',
  },
  {
    id: 5,
    email: 'vetal05most@gmail.com',
    password: 'password123',
    name: 'Новий користувач (очікує ролі)',
    role: 'Guest',
    image: 'N/A',
  },
]);

/**
 * Одноразова міграція легаси даних. Запускаємо через мікротаску, щоб усі інші
 * мок-сервіси (передусім MockUserService) встигли зареєструвати свої таблиці
 * через defineTable із власними seed-даними. Інакше тут можна випадково
 * закешувати чужу таблицю порожнім масивом і назавжди втратити seed.
 *
 * Лікує:
 *  • UTF-8 «закарлючки» в іменах (Ð, Ñ…) — спадщина старого btoa-флоу.
 *  • Залишки ролі "User" — це мертва роль попередньої версії продукту,
 *    адмін все одно нічого з нею не зможе зробити (її прибрано з селекту).
 */
queueMicrotask(() => {
  const stripDeadRole = (role) => {
    if (Array.isArray(role)) {
      const out = role.filter(
        (r) => String(r || '').toLowerCase() !== 'user',
      );
      return out.length ? out : ['Guest'];
    }
    return String(role || '').toLowerCase() === 'user' ? 'Guest' : role;
  };

  const repairUser = (u) => {
    if (!u) return;
    if (typeof u.name === 'string') {
      const fixed = repairMojibakeText(u.name);
      if (fixed !== u.name) u.name = fixed;
    }
    const nextRole = stripDeadRole(u.role);
    if (JSON.stringify(nextRole) !== JSON.stringify(u.role)) {
      u.role = nextRole;
    }
  };

  for (const u of MOCK_USERS) repairUser(u);

  /**
   * Auth-таблиця — джерело правди про те, кому дозволений вхід. Якщо в довіднику
   * /users чогось бракує (наприклад, після старого бага moка довідник опинився
   * порожнім), дзеркалимо auth → users dir. Зворотній напрям (users dir → auth)
   * нас не цікавить: запис без пароля все одно не може залогінитись.
   */
  try {
    for (const auth of MOCK_USERS) {
      syncUserDirectoryEntry({
        email: auth.email,
        name: auth.name,
        role: auth.role,
        image: auth.image,
      });
    }
    const dir = getUsersDirectory();
    for (const u of dir) repairUser(u);
  } catch {
    /* noop */
  }
});

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
  
  const encodedHeader = b64UrlEncodeJson(header);
  const encodedPayload = b64UrlEncodeJson(payload);
  const signature = b64UrlEncodeJson('mock_signature');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAuthService {
  /**
   * Скидання пароля користувача (тільки для адмін-флоу в моках).
   */
  static findAuthUserByEmail(email) {
    const n = normalizeEmail(email);
    return MOCK_USERS.find((x) => x.email.toLowerCase() === n) || null;
  }

  /**
   * Прибирає запис із auth-таблиці. Викликається з MockUserService.delete, щоб
   * видалений в адмінці користувач більше не міг увійти і щоб дзеркальний цикл
   * `auth → users` на старті не повертав його у довідник.
   */
  static deleteAuthUserByEmail(email) {
    const n = normalizeEmail(email);
    if (!n) return;
    const idx = MOCK_USERS.findIndex((u) => normalizeEmail(u.email) === n);
    if (idx >= 0) MOCK_USERS.splice(idx, 1);
  }

  /**
   * Гарантує, що для користувача існує запис в auth-таблиці (логін/пароль)
   * і паралельний запис у довіднику /users. Викликається з MockUserService.createUser,
   * щоб користувачі створені адміном могли потім увійти.
   */
  static ensureAuthUser({ email, name, role, image, password } = {}) {
    const emailNorm = normalizeEmail(email);
    if (!emailNorm) return null;

    const roleStr = Array.isArray(role) ? role.find(Boolean) || 'Guest' : role || 'Guest';
    syncUserDirectoryEntry({ email, name, role, image });

    let authUser = MockAuthService.findAuthUserByEmail(email);
    if (!authUser) {
      const nextId = MOCK_USERS.length
        ? Math.max(...MOCK_USERS.map((u) => Number(u.id) || 0)) + 1
        : 1;
      authUser = {
        id: nextId,
        email,
        password: String(password ?? 'password123'),
        name: name || email,
        role: roleStr,
        image: image || 'N/A',
      };
      MOCK_USERS.push(authUser);
    } else {
      if (password) authUser.password = String(password);
      if (name && authUser.name !== name) authUser.name = name;
      if (image && authUser.image !== image) authUser.image = image;
      authUser.role = roleStr;
    }
    return authUser;
  }

  /** Оновити роль у мок-автентифікації після зміни в картці користувача (адмін). */
  static syncRoleForEmail(email, roles) {
    const u = MockAuthService.findAuthUserByEmail(email);
    if (!u) return;
    const arr = Array.isArray(roles) ? roles : [roles];
    const first = arr.find(Boolean);
    u.role = first != null ? String(first) : "Guest";
  }

  static adminSetPassword(userId, newPassword) {
    const id = Number(userId);
    const u = MOCK_USERS.find((x) => x.id === id);
    if (!u) {
      throw {
        response: { status: 404, data: { message: "Користувача не знайдено" } },
      };
    }
    const pw = String(newPassword ?? "");
    if (pw.length < 6) {
      throw {
        response: {
          status: 400,
          data: { message: "Пароль має містити щонайменше 6 символів" },
        },
      };
    }
    u.password = pw;
    return { success: true };
  }

  /** Скидання пароля за email (id у довіднику користувачів може відрізнятися від auth). */
  static adminSetPasswordForEmail(email, newPassword) {
    const u = MockAuthService.findAuthUserByEmail(email);
    if (!u) {
      throw {
        response: {
          status: 404,
          data: {
            message:
              "Немає облікового запису для входу з цим email. У моках додайте користувача в MockAuthService.",
          },
        },
      };
    }
    return MockAuthService.adminSetPassword(u.id, newPassword);
  }

  static setAuthorizationToken(token) {
    // Моки не потребують реального токену
    console.log('[MOCK] Setting auth token:', token ? 'Token set' : 'Token cleared');
  }

  static async signIn(model) {
    await delay(MOCK_DELAY);

    const email = (model.email || '').trim().toLowerCase();
    const password = model.password ?? '';

    const byEmail = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email
    );

    if (!byEmail) {
      throw {
        response: {
          status: 401,
          data: {
            code: 'EMAIL_NOT_FOUND',
            message: 'Користувача з таким email не знайдено.',
          },
        },
      };
    }

    if (byEmail.password !== password) {
      throw {
        response: {
          status: 401,
          data: {
            code: 'WRONG_PASSWORD',
            message: 'Невірний пароль.',
          },
        },
      };
    }

    const user = byEmail;

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
          const payload = b64UrlDecodeJson(parts[1]);
          user = {
            id: MOCK_USERS.length + 1,
            email: payload.email || 'google@test.com',
            name: payload.name || payload.given_name || 'Google User',
            role: 'Guest',
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
          role: 'Guest',
          image: 'N/A',
        };
      }
    } else {
      // Fallback для інших провайдерів або якщо передано email/name напряму
      user = {
        id: MOCK_USERS.length + 1,
        email: model.email || 'external@test.com',
        name: model.name || 'External User',
        role: 'Guest',
        image: model.image || 'N/A',
      };
    }

    // Перевірка чи користувач вже існує
    let existingUser = MOCK_USERS.find(u => normalizeEmail(u.email) === normalizeEmail(user.email));
    if (!existingUser) {
      MOCK_USERS.push(user);
      existingUser = user;
    }

    // Зеркалимо у адмінський довідник /users, щоб новий гість був видимий списком.
    syncUserDirectoryEntry(existingUser);

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
    const emailNorm = (model.email || '').trim().toLowerCase();
    const existingUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === emailNorm
    );
    if (existingUser) {
      throw {
        response: {
          data: 'User already exists',
          status: 409,
        },
      };
    }

    const nextAuthId = MOCK_USERS.length
      ? Math.max(...MOCK_USERS.map((u) => Number(u.id) || 0)) + 1
      : 1;
    const displayName = [model.surname, model.name, model.patronymic]
      .map((part) => (part || '').toString().trim())
      .filter(Boolean)
      .join(' ') || model.name || model.email.split('@')[0];
    const newUser = {
      id: nextAuthId,
      email: model.email,
      password: model.password,
      name: displayName,
      role: 'Guest',
      image: 'N/A',
    };

    MOCK_USERS.push(newUser);

    // Дзеркало в адмінський довідник: новий гість має одразу зʼявлятись на /users.
    syncUserDirectoryEntry(newUser);

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
      
      const payload = b64UrlDecodeJson(parts[1]);
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

