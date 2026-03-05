// Mock Cart Registry - реєстр поємників (візків)
// Формат: англійська літера + три випадкові числа (наприклад, A123, B456)

const MOCK_DELAY = 100;

// Реєстр поємників
const cartRegistry = [
  'A123',
  'A456',
  'A789',
  'B123',
  'B456',
  'B789',
  'C123',
  'C456',
  'C789',
  'D123',
  'D456',
  'D789',
  'E123',
  'E456',
  'E789',
  'F123',
  'F456',
  'F789',
  'G123',
  'G456',
  'G789',
  'H123',
  'H456',
  'H789',
  'I123',
  'I456',
  'I789',
  'J123',
  'J456',
  'J789',
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Перевірити, чи існує поємник в реєстрі
export const validateCartNumber = async (cartNumber) => {
  await delay(MOCK_DELAY);
  const normalizedCartNumber = cartNumber.trim().toUpperCase();
  return cartRegistry.includes(normalizedCartNumber);
};

// Отримати всі поємники з реєстру
export const getAllCarts = async () => {
  await delay(MOCK_DELAY);
  return JSON.parse(JSON.stringify(cartRegistry));
};

// Додати новий поємник до реєстру
export const addCartToRegistry = async (cartNumber) => {
  await delay(MOCK_DELAY);
  const normalizedCartNumber = cartNumber.trim().toUpperCase();
  
  // Перевірка формату: літера + 3 цифри
  const formatRegex = /^[A-Z]\d{3}$/;
  if (!formatRegex.test(normalizedCartNumber)) {
    throw {
      response: {
        data: 'Невірний формат номера поємника. Очікується формат: літера + 3 цифри (наприклад, A123)',
        status: 400,
      },
    };
  }
  
  if (cartRegistry.includes(normalizedCartNumber)) {
    throw {
      response: {
        data: 'Поємник з таким номером вже існує',
        status: 400,
      },
    };
  }
  
  cartRegistry.push(normalizedCartNumber);
  // Сортуємо реєстр для зручності
  cartRegistry.sort();
  return JSON.parse(JSON.stringify(cartRegistry));
};

// Видалити поємник з реєстру
export const deleteCartFromRegistry = async (cartNumber) => {
  await delay(MOCK_DELAY);
  const normalizedCartNumber = cartNumber.trim().toUpperCase();
  
  const index = cartRegistry.indexOf(normalizedCartNumber);
  if (index === -1) {
    throw {
      response: {
        data: 'Поємник з таким номером не знайдено в реєстрі',
        status: 404,
      },
    };
  }
  
  cartRegistry.splice(index, 1);
  return JSON.parse(JSON.stringify(cartRegistry));
};

// Експортуємо реєстр для доступу з інших модулів
export { cartRegistry };
