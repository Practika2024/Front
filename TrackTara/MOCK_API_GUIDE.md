# 🔧 Гайд по використанню Mock API

## Огляд

Проект тепер підтримує автоматичне перемикання між реальним API та мок-даними. Це дозволяє продовжувати розробку фронтенду без залежності від бекенду.

## 🚀 Швидкий старт

### 1. Налаштування

Створіть файл `.env` в корені проекту (або скопіюйте `.env.example`):

```env
# Для використання мок-даних
VITE_USE_MOCK_API=true

# Для використання реального API
# VITE_USE_MOCK_API=false
```

### 2. Перезапустіть dev сервер

Після зміни `.env` файлу необхідно перезапустити Vite:

```bash
npm run dev
```

## 📁 Структура

```
src/utils/
├── config/
│   └── apiConfig.js          # Конфігурація API
├── services/
│   ├── ServiceFactory.js     # Автоматичний вибір між моками та реальним API
│   ├── index.js              # Центральний експорт сервісів
│   ├── mock/                 # Мок-сервіси
│   │   ├── MockAuthService.js
│   │   ├── MockUserService.js
│   │   ├── MockProductService.js
│   │   ├── MockContainerService.js
│   │   └── ...
│   └── [реальні сервіси]    # Оригінальні сервіси (залишаються без змін)
```

## 🔄 Як це працює

1. **ServiceFactory** автоматично вибирає між реальними та мок-сервісами
2. Всі мок-сервіси мають **ті самі інтерфейси** що й реальні
3. Моки імітують затримки мережевих запитів (500ms за замовчуванням)
4. Дані зберігаються в пам'яті (скидаються при перезавантаженні)

## 📝 Використання

### Правильний спосіб імпорту

```javascript
// ✅ ПРАВИЛЬНО - використовуйте ServiceFactory
import { AuthService, UserService, ProductService } from '@/utils/services';

// ❌ НЕПРАВИЛЬНО - прямий імпорт обходить ServiceFactory
import { AuthService } from '@/utils/services/AuthService';
```

### Приклад оновлення actions

**Було:**
```javascript
import { AuthService } from "../../../utils/services/AuthService";
import { UserService } from "../../../utils/services/UserService";
```

**Стало:**
```javascript
import { AuthService, UserService } from "../../../utils/services";
```

## 🎯 Мок-дані

### Тестові користувачі

Для входу використовуйте:

- **Operator:** `operator@test.com` / `password123`
- **Administrator:** `admin@test.com` / `password123`

### Початкові дані

Моки містять початкові дані:
- 3 користувачі
- 3 продукти
- 3 контейнери
- 4 типи продуктів
- 4 типи контейнерів

## 🔧 Налаштування моків

### Зміна затримки

В `src/utils/config/apiConfig.js`:

```javascript
export const API_CONFIG = {
  MOCK_DELAY: 500, // мілісекунди
};
```

### Додавання нових мок-даних

Редагуйте відповідні файли в `src/utils/services/mock/`:
- `MockUserService.js` - користувачі
- `MockProductService.js` - продукти
- `MockContainerService.js` - контейнери
- і т.д.

## 🔄 Перемикання між моками та реальним API

1. Відкрийте `.env` файл
2. Змініть `VITE_USE_MOCK_API`:
   - `true` - моки
   - `false` - реальний API
3. Перезапустіть dev сервер

## ⚠️ Важливо

1. **Не видаляйте реальні сервіси** - вони потрібні для майбутнього використання
2. **Використовуйте ServiceFactory** для всіх імпортів сервісів
3. **Моки зберігають дані в пам'яті** - при перезавантаженні сторінки дані скидаються
4. **JWT токени в моках** - спрощені, не реальні JWT

## 📋 Чеклист міграції

- [ ] Створити `.env` файл з `VITE_USE_MOCK_API=true`
- [ ] Оновити імпорти в `actions` файлах
- [ ] Оновити імпорти в компонентах (якщо є прямі)
- [ ] Перевірити роботу з моками
- [ ] Зберегти всі реальні сервіси для майбутнього

## 🐛 Troubleshooting

### Моки не працюють

1. Перевірте що `.env` файл існує в корені проекту
2. Перевірте що `VITE_USE_MOCK_API=true`
3. Перезапустіть dev сервер
4. Перевірте консоль браузера - має бути повідомлення `🔧 [SERVICE FACTORY] Using MOCK services`

### Помилки імпорту

Переконайтеся що використовуєте:
```javascript
import { ServiceName } from '@/utils/services';
```

А не:
```javascript
import { ServiceName } from '@/utils/services/ServiceName';
```

## 📚 Додаткова інформація

Всі реальні сервіси залишаються в проекті і готові до використання коли бекенд буде готовий. Просто змініть `VITE_USE_MOCK_API=false` в `.env`.


