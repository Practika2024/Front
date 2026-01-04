// Mock Container Types Service

const MOCK_DELAY = 500;

let mockContainerTypes = [
  { id: 1, name: 'Пластиковий' },
  { id: 2, name: 'Металевий' },
  { id: 3, name: 'Картонний' },
  { id: 4, name: 'Скляний' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllContainerTypes = async () => {
  await delay(MOCK_DELAY);
  return [...mockContainerTypes];
};

export const createContainerType = async (typeData) => {
  await delay(MOCK_DELAY);
  const newType = {
    id: Math.max(...mockContainerTypes.map(t => t.id), 0) + 1,
    name: typeData.name,
  };
  mockContainerTypes.push(newType);
  return newType;
};

export const getContainerTypeNameById = async (id) => {
  await delay(MOCK_DELAY);
  const type = mockContainerTypes.find(t => t.id === parseInt(id));
  return type ? type.name : 'Unknown';
};

export const updateContainerType = async (id, typeData) => {
  await delay(MOCK_DELAY);
  const type = mockContainerTypes.find(t => t.id === parseInt(id));
  if (!type) {
    throw {
      response: {
        data: 'Container type not found',
        status: 404,
      },
    };
  }
  Object.assign(type, typeData);
  return type;
};

export const deleteContainerType = async (id) => {
  await delay(MOCK_DELAY);
  const index = mockContainerTypes.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    throw {
      response: {
        data: 'Container type not found',
        status: 404,
      },
    };
  }
  mockContainerTypes.splice(index, 1);
};

