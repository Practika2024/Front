// Конфігурація для перемикання між реальним API та моками.
// Дефолт: моки УВІМКНЕНО (зокрема для Vercel-демо без бекенду).
// Реальний API — лише при явному VITE_USE_MOCK_API=false.
const useMockDefault = import.meta.env.VITE_USE_MOCK_API !== 'false';

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
    CATEGORIES: import.meta.env.VITE_API_CATEGORIES_URL || 'http://13.60.245.135:4312/categories',
    MANUFACTURERS: import.meta.env.VITE_API_MANUFACTURERS_URL || 'http://13.60.245.135:4312/manufacturers',
  },
  
  // Затримка для імітації мережевих запитів (в мілісекундах)
  MOCK_DELAY: 500,
};


