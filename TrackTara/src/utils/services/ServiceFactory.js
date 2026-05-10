// Service Factory - автоматично вибирає між реальними та мок-сервісами
import { API_CONFIG } from '../config/apiConfig';

// Реальні сервіси
import { AuthService } from './AuthService';
import { UserService } from './UserService';
import { ProductService } from './ProductService';
import * as ContainerService from './ContainerService';
import * as ContainerTypesService from './ContainerTypesService';
import * as ProductTypesService from './ProductTypesService';
import { RoleService } from './RoleService';
import * as ContainerHistoryService from './ContainerHistoryService';
import * as ProductHistoryService from './ProductHistoryService';
import { OrderService } from './OrderService';
import { ClientRouteService } from './ClientRouteService';

// Мок-сервіси
import { MockAuthService } from './mock/MockAuthService';
import { MockUserService } from './mock/MockUserService';
import { MockProductService } from './mock/MockProductService';
import * as MockContainerService from './mock/MockContainerService';
import * as MockContainerTypesService from './mock/MockContainerTypesService';
import * as MockProductTypesService from './mock/MockProductTypesService';
import { MockRoleService } from './mock/MockRoleService';
import { MockSectorService } from './mock/MockSectorService';
import * as MockContainerHistoryService from './mock/MockContainerHistoryService';
import * as MockProductHistoryService from './mock/MockProductHistoryService';
import { OrderService as MockOrderService } from './mock/MockOrderService';
import { MockClientRouteService } from './mock/MockClientRouteService';
import { SectorService as RealSectorService } from './SectorService';

/**
 * Service Factory - вибирає між реальними та мок-сервісами
 * Використовуйте цей файл для імпорту сервісів замість прямого імпорту
 * 
 * Для перемикання між моками та реальним API:
 * 1. Встановіть VITE_USE_MOCK_API=true в .env для моків
 * 2. Встановіть VITE_USE_MOCK_API=false або видаліть змінну для реального API
 */

// Перевірка чи використовувати моки
const useMock = API_CONFIG.USE_MOCK_API;

if (useMock) {
  console.log('🔧 [SERVICE FACTORY] Using MOCK services');
} else {
  console.log('🌐 [SERVICE FACTORY] Using REAL API services');
}

// Експорт сервісів з автоматичним вибором
export const AuthServiceInstance = useMock ? MockAuthService : AuthService;
export const UserServiceInstance = useMock ? MockUserService : UserService;
export const ProductServiceInstance = useMock ? MockProductService : ProductService;
export const ContainerServiceInstance = useMock ? MockContainerService : ContainerService;
export const ContainerTypesServiceInstance = useMock ? MockContainerTypesService : ContainerTypesService;
export const ProductTypesServiceInstance = useMock ? MockProductTypesService : ProductTypesService;
export const RoleServiceInstance = useMock ? MockRoleService : RoleService;
export const ContainerHistoryServiceInstance = useMock ? MockContainerHistoryService : ContainerHistoryService;
export const ProductHistoryServiceInstance = useMock ? MockProductHistoryService : ProductHistoryService;
export const OrderServiceInstance = useMock ? MockOrderService : OrderService;
export const ClientRouteServiceInstance = useMock ? MockClientRouteService : ClientRouteService;

// Для зворотної сумісності - експортуємо також як класи/об'єкти
export { AuthServiceInstance as AuthService };
export { UserServiceInstance as UserService };
export { ProductServiceInstance as ProductService };
export { RoleServiceInstance as RoleService };

// Експортуємо функції для ContainerService (вони експортуються як окремі функції)
export const {
  createContainer,
  getAllContainers,
  getContainerById,
  deleteContainer,
  setProductToContainer,
  updateContainer,
  clearProductFromTare,
} = ContainerServiceInstance;

// Експортуємо функції для ContainerTypesService
export const {
  getAllContainerTypes,
  createContainerType,
  getContainerTypeNameById,
  updateContainerType,
  deleteContainerType,
} = ContainerTypesServiceInstance;

// Експортуємо функції для ProductTypesService
export const {
  getAllProductTypes,
  addProductType,
  updateProductType,
  deleteProductType,
} = ProductTypesServiceInstance;

// Сектори: мок або HTTP (див. VITE_API_SECTORS_URL у apiConfig)
export const SectorService = useMock ? MockSectorService : RealSectorService;

// Експортуємо функції для ContainerHistoryService
export const {
  getAllContainerHistories,
  getContainerHistoryById,
} = ContainerHistoryServiceInstance;

// Експортуємо функції для ProductHistoryService
export const {
  getAllProductHistories,
  getProductHistoryById,
} = ProductHistoryServiceInstance;

// Експортуємо OrderService
export { OrderServiceInstance as OrderService };
export { ClientRouteServiceInstance as ClientRouteService };

/** Пакування, бракімаг, реєстр візків: при `VITE_USE_MOCK_API=false` — HTTP до бекенду з відкатом на персистентні моки, якщо endpoint відсутній; при `true` — напряму моки. */
export {
  getAllPackingBoxes,
  createPackingBox,
  deletePackingBox,
  addToPackingBox,
  transferPackingBoxContent,
} from './PackingBoxService';

export {
  getAllBrakiMagItems,
  addToBrakiMag,
  removeFromBrakiMag,
  updateBrakiMagItem,
  transferBrakiMagToContainer,
} from './BrakiMagService';

export {
  validateCartNumber,
  getAllCarts,
  addCartToRegistry,
  deleteCartFromRegistry,
} from './CartRegistryService';

