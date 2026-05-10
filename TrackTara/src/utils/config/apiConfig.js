// Конфігурація для перемикання між реальним API та моками.
// Дефолт: моки УВІМКНЕНО (зокрема для Vercel-демо без бекенду).
// Реальний API — лише при явному VITE_USE_MOCK_API=false.
const useMockDefault = import.meta.env.VITE_USE_MOCK_API !== 'false';

/** Спільний хост для legacy-ендпойнтів (категорії, виробники, кошик тощо). */
const legacyOrigin =
  import.meta.env.VITE_API_LEGACY_ORIGIN || 'http://13.60.245.135:4312';

export const API_CONFIG = {
  USE_MOCK_API: useMockDefault,
  
  // Базові URL для реального API
  BASE_URLS: {
    ACCOUNT: import.meta.env.VITE_API_ACCOUNT_URL || 'http://localhost:5081/account',
    USERS: import.meta.env.VITE_API_USERS_URL || 'http://localhost:5081/users',
    PRODUCTS: import.meta.env.VITE_API_PRODUCTS_URL || 'http://localhost:5081/products',
    CONTAINERS: import.meta.env.VITE_API_CONTAINERS_URL || 'http://localhost:5081/containers',
    CONTAINER_TYPES: import.meta.env.VITE_API_CONTAINER_TYPES_URL || 'http://localhost:5081/containers-type',
    PRODUCT_TYPES: import.meta.env.VITE_API_PRODUCT_TYPES_URL || 'http://localhost:5081/product-types',
    ROLES: import.meta.env.VITE_API_ROLES_URL || 'http://localhost:5081/roles',
    /** Сектори складу (ряди). Очікувані шляхи: get-all, create, delete/:sector, add-row, remove-row/... */
    SECTORS: import.meta.env.VITE_API_SECTORS_URL || 'http://localhost:5081/sectors',
    CATEGORIES: import.meta.env.VITE_API_CATEGORIES_URL || `${legacyOrigin}/categories`,
    MANUFACTURERS: import.meta.env.VITE_API_MANUFACTURERS_URL || `${legacyOrigin}/manufacturers`,
    CART_ITEMS: import.meta.env.VITE_API_CART_ITEMS_URL || `${legacyOrigin}/cart-items`,
    /** База для шляху /Images/productImages/... */
    PRODUCT_IMAGES_ORIGIN:
      import.meta.env.VITE_API_PRODUCT_IMAGES_ORIGIN || legacyOrigin,
    /** Реєстр нестач (бракімаг). Якщо endpoint ще немає — сервіс відкотиться на локальне сховище моків. */
    BRAKIMAG: import.meta.env.VITE_API_BRAKIMAG_URL || 'http://localhost:5081/brakimag',
    /** Реєстр візків. */
    CART_REGISTRY: import.meta.env.VITE_API_CART_REGISTRY_URL || 'http://localhost:5081/cart-registry',
    /** Пакування в коробки. */
    PACKING_BOXES: import.meta.env.VITE_API_PACKING_BOXES_URL || 'http://localhost:5081/packing-boxes',
  },
  
  // Затримка для імітації мережевих запитів (в мілісекундах)
  MOCK_DELAY: 500,
};


