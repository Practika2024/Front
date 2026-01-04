// Mock Product Types Service - відповідає формату ProductTypesService (функції, не клас)

const MOCK_DELAY = 500;

let mockProductTypes = [
  { id: 1, name: 'Молочні продукти' },
  { id: 2, name: 'Хлібобулочні вироби' },
  { id: 3, name: 'Яйця' },
  { id: 4, name: 'М\'ясні продукти' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Експортуємо функції у тому ж форматі що й реальний ProductTypesService
export const getAllProductTypes = async () => {
  await delay(MOCK_DELAY);
  return [...mockProductTypes];
};

export const addProductType = async (productType) => {
  await delay(MOCK_DELAY);
  const newType = {
    id: Math.max(...mockProductTypes.map(t => t.id), 0) + 1,
    name: productType.name,
  };
  mockProductTypes.push(newType);
  return newType;
};

export const updateProductType = async (id, productType) => {
  await delay(MOCK_DELAY);
  const type = mockProductTypes.find(t => t.id === parseInt(id));
  if (!type) {
    throw {
      response: {
        data: 'Product type not found',
        status: 404,
      },
    };
  }
  Object.assign(type, productType);
  return type;
};

export const deleteProductType = async (id) => {
  await delay(MOCK_DELAY);
  const index = mockProductTypes.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    throw {
      response: {
        data: 'Product type not found',
        status: 404,
      },
    };
  }
  mockProductTypes.splice(index, 1);
  return { success: true };
};

