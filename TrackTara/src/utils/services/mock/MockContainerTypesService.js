// Mock Container Types Service

import { defineTable, clone } from './_mockDb';

const MOCK_DELAY = 500;

const mockContainerTypes = defineTable('containerTypes', [
  { id: 1, name: 'Пластиковий' },
  { id: 2, name: 'Металевий' },
  { id: 3, name: 'Картонний' },
  { id: 4, name: 'Скляний' },
]);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllContainerTypes = async () => {
  await delay(MOCK_DELAY);
  return clone(mockContainerTypes);
};

export const createContainerType = async (typeData) => {
  await delay(MOCK_DELAY);
  const newType = {
    id: Math.max(...mockContainerTypes.map(t => t.id), 0) + 1,
    name: typeData.name,
  };
  mockContainerTypes.push(newType);
  return clone(newType);
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
  return clone(type);
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


