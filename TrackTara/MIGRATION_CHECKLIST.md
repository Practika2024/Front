# ✅ Чеклист міграції на Mock API

## Виконані завдання

- [x] Створено конфігурацію API (`src/utils/config/apiConfig.js`)
- [x] Створено Mock Services для всіх основних сервісів
- [x] Створено ServiceFactory для автоматичного вибору
- [x] Оновлено всі actions для використання ServiceFactory
- [x] Оновлено всі компоненти для використання ServiceFactory
- [x] Створено документацію (MOCK_API_GUIDE.md)
- [x] Оновлено vite.config.js для підтримки .env

## Що потрібно зробити вручну

### 1. Створити .env файл

Створіть файл `.env` в корені проекту з наступним вмістом:

```env
VITE_USE_MOCK_API=true
```

### 2. Перезапустити dev сервер

```bash
npm run dev
```

### 3. Перевірити роботу

1. Відкрийте консоль браузера
2. Має з'явитися повідомлення: `🔧 [SERVICE FACTORY] Using MOCK services`
3. Спробуйте увійти з тестовими даними:
   - Email: `operator@test.com`
   - Password: `password123`

### 4. Тестування функціональності

- [ ] Вхід/Реєстрація
- [ ] Перегляд продуктів
- [ ] Створення/редагування контейнерів
- [ ] Управління користувачами (якщо адмін)
- [ ] Управління типами

## Перемикання на реальний API

Коли бекенд буде готовий:

1. Відкрийте `.env` файл
2. Змініть `VITE_USE_MOCK_API=false` або видаліть змінну
3. Перезапустіть dev сервер
4. Перевірте що в консолі: `🌐 [SERVICE FACTORY] Using REAL API services`

## Важливі зауваження

1. **Всі реальні сервіси залишилися** - вони не були видалені або змінені
2. **Моки зберігають дані в пам'яті** - при перезавантаженні сторінки дані скидаються
3. **JWT токени в моках спрощені** - не реальні JWT, але працюють для тестування

## Можливі проблеми

### Помилка: "Cannot find module '@/utils/services'"

Якщо використовується алиас `@`, перевірте `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Моки не працюють

1. Перевірте що `.env` файл існує в корені проекту
2. Перевірте що `VITE_USE_MOCK_API=true`
3. Перезапустіть dev сервер
4. Перевірте консоль браузера

## Додаткові моки

Якщо потрібно додати моки для інших сервісів (CategoryService, ManufacturerService, тощо):

1. Створіть файл `src/utils/services/mock/Mock[ServiceName].js`
2. Реалізуйте ті самі методи що й у реальному сервісі
3. Додайте експорт в `ServiceFactory.js`
4. Додайте в `src/utils/services/index.js`


