/**
 * Центральний експорт сервісів
 * 
 * ВИКОРИСТОВУЙТЕ ЦЕЙ ФАЙЛ для імпорту сервісів замість прямого імпорту!
 * 
 * Приклад використання:
 * import { AuthService, UserService, ProductService } from '@/utils/services';
 * import { getAllContainers, createContainer } from '@/utils/services';
 * 
 * Сервіси автоматично перемикаються між реальним API та моками
 * залежно від налаштування VITE_USE_MOCK_API в .env файлі
 */

// Експортуємо класи/об'єкти сервісів
export {
  AuthService,
  UserService,
  ProductService,
  RoleService,
  SectorService,
  OrderService,
} from './ServiceFactory';

// Експортуємо всі функції (включаючи функції для ContainerService, ContainerTypesService, ProductTypesService)
// для зворотної сумісності з існуючим кодом
export * from './ServiceFactory';

// Експортуємо функції для реєстру поємників
export {
    validateCartNumber,
    getAllCarts,
    addCartToRegistry,
    deleteCartFromRegistry,
} from './mock/MockCartRegistry';

// Експортуємо функції для бракімагу
export {
    getAllBrakiMagItems,
    addToBrakiMag,
    removeFromBrakiMag,
    updateBrakiMagItem,
} from './mock/MockBrakiMagService';

