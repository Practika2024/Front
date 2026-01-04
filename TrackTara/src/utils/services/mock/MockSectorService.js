// Mock Sector Service - управління секторами та рядами складу

const MOCK_DELAY = 500;

// Мок-дані секторів та рядів
// Структура: { sector: 'A', rows: [1, 2, 3, ...] }
let mockSectors = [
  { sector: 'A', rows: [1, 2, 3, 4, 5] },
  { sector: 'B', rows: [1, 2, 3] },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MockSectorService = {
  // Отримати всі сектори з рядами
  getAllSectors: async () => {
    await delay(MOCK_DELAY);
    return [...mockSectors];
  },

  // Отримати сектор за назвою
  getSector: async (sectorName) => {
    await delay(MOCK_DELAY);
    return mockSectors.find(s => s.sector === sectorName.toUpperCase());
  },

  // Створити новий сектор
  createSector: async (sectorName) => {
    await delay(MOCK_DELAY);
    const sector = sectorName.toUpperCase();
    
    // Перевірка чи сектор вже існує
    if (mockSectors.find(s => s.sector === sector)) {
      throw {
        response: {
          data: 'Сектор вже існує',
          status: 409,
        },
      };
    }

    const newSector = {
      sector,
      rows: [],
    };
    mockSectors.push(newSector);
    return newSector;
  },

  // Видалити сектор
  deleteSector: async (sectorName) => {
    await delay(MOCK_DELAY);
    const index = mockSectors.findIndex(s => s.sector === sectorName.toUpperCase());
    if (index === -1) {
      throw {
        response: {
          data: 'Сектор не знайдено',
          status: 404,
        },
      };
    }
    mockSectors.splice(index, 1);
    return { success: true };
  },

  // Додати ряд до сектора
  addRowToSector: async (sectorName, rowNumber) => {
    await delay(MOCK_DELAY);
    const sector = mockSectors.find(s => s.sector === sectorName.toUpperCase());
    
    if (!sector) {
      throw {
        response: {
          data: 'Сектор не знайдено',
          status: 404,
        },
      };
    }

    const row = parseInt(rowNumber);
    if (isNaN(row) || row < 1 || row > 99) {
      throw {
        response: {
          data: 'Номер ряду повинен бути від 1 до 99',
          status: 400,
        },
      };
    }

    // Перевірка чи ряд вже існує
    if (sector.rows.includes(row)) {
      throw {
        response: {
          data: 'Ряд вже існує в цьому секторі',
          status: 409,
        },
      };
    }

    sector.rows.push(row);
    sector.rows.sort((a, b) => a - b); // Сортуємо ряди
    return sector;
  },

  // Видалити ряд з сектора
  removeRowFromSector: async (sectorName, rowNumber) => {
    await delay(MOCK_DELAY);
    const sector = mockSectors.find(s => s.sector === sectorName.toUpperCase());
    
    if (!sector) {
      throw {
        response: {
          data: 'Сектор не знайдено',
          status: 404,
        },
      };
    }

    const row = parseInt(rowNumber);
    const index = sector.rows.indexOf(row);
    if (index === -1) {
      throw {
        response: {
          data: 'Ряд не знайдено в цьому секторі',
          status: 404,
        },
      };
    }

    sector.rows.splice(index, 1);
    return sector;
  },

  // Перевірити чи існує сектор
  sectorExists: async (sectorName) => {
    await delay(MOCK_DELAY / 2); // Швидша перевірка
    return mockSectors.some(s => s.sector === sectorName.toUpperCase());
  },

  // Перевірити чи існує ряд в секторі
  rowExistsInSector: async (sectorName, rowNumber) => {
    await delay(MOCK_DELAY / 2); // Швидша перевірка
    const sector = mockSectors.find(s => s.sector === sectorName.toUpperCase());
    if (!sector) return false;
    return sector.rows.includes(parseInt(rowNumber));
  },
};

