/**
 * Утиліти для парсингу коду контейнера
 * Формат: СЕКТОР-РЯД-CNT-НОМЕР (наприклад: A01-CNT-001)
 */

/**
 * Витягує сектор з коду контейнера
 * @param {string} containerCode - Код контейнера (наприклад: "A01-CNT-001")
 * @returns {string|null} - Сектор (наприклад: "A") або null
 */
export const extractSectorFromCode = (containerCode) => {
  if (!containerCode) return null;
  
  // Формат: СЕКТОР-РЯД-CNT-НОМЕР
  // Приклад: A01-CNT-001
  const match = containerCode.match(/^([A-Z])(\d{2})-CNT-/);
  return match ? match[1] : null;
};

/**
 * Витягує ряд з коду контейнера
 * @param {string} containerCode - Код контейнера (наприклад: "A01-CNT-001")
 * @returns {number|null} - Ряд (наприклад: 1) або null
 */
export const extractRowFromCode = (containerCode) => {
  if (!containerCode) return null;
  
  // Формат: СЕКТОР-РЯД-CNT-НОМЕР
  // Приклад: A01-CNT-001, де 01 - це ряд
  const match = containerCode.match(/^[A-Z](\d{2})-CNT-/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Витягує номер контейнера з коду
 * @param {string} containerCode - Код контейнера (наприклад: "A01-CNT-001")
 * @returns {string|null} - Номер (наприклад: "001") або null
 */
export const extractContainerNumberFromCode = (containerCode) => {
  if (!containerCode) return null;
  
  const match = containerCode.match(/-CNT-(\d+)$/);
  return match ? match[1] : null;
};

/**
 * Перевіряє чи код контейнера має правильний формат
 * @param {string} containerCode - Код контейнера
 * @returns {boolean} - true якщо формат правильний
 */
export const isValidContainerCode = (containerCode) => {
  if (!containerCode) return false;
  
  // Формат: СЕКТОР-РЯД-CNT-НОМЕР
  // Приклад: A01-CNT-001
  const pattern = /^[A-Z]\d{2}-CNT-\d+$/;
  return pattern.test(containerCode);
};

/**
 * Парсить код контейнера і повертає об'єкт з сектором та номером ряду
 * @param {string} containerCode - Код контейнера (наприклад: "A01-CNT-001")
 * @returns {{sector: string, rowNumber: number}|null} - Об'єкт з сектором та номером ряду, або null
 */
export const parseContainerCode = (containerCode) => {
  if (!containerCode) return null;
  
  const sector = extractSectorFromCode(containerCode);
  const rowNumber = extractRowFromCode(containerCode);
  
  if (sector && rowNumber !== null) {
    return { sector, rowNumber };
  }
  
  return null;
};

