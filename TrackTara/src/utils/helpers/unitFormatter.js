// Допоміжна функція для форматування одиниць вимірювання

/**
 * Отримує текстовий опис одиниці вимірювання
 * @param {string} unitType - Тип одиниці: 'liters', 'kilograms', 'pieces'
 * @returns {string} - Текстовий опис одиниці
 */
export const getUnitLabel = (unitType) => {
    switch (unitType) {
        case 'liters':
            return 'л';
        case 'kilograms':
            return 'кг';
        case 'pieces':
            return 'шт';
        default:
            return 'л/кг';
    }
};

/**
 * Отримує повний текстовий опис одиниці вимірювання
 * @param {string} unitType - Тип одиниці: 'liters', 'kilograms', 'pieces'
 * @returns {string} - Повний текстовий опис одиниці
 */
export const getUnitFullLabel = (unitType) => {
    switch (unitType) {
        case 'liters':
            return 'літри';
        case 'kilograms':
            return 'кілограми';
        case 'pieces':
            return 'штуки';
        default:
            return 'літри/кілограми';
    }
};

/**
 * Форматує кількість з одиницею вимірювання
 * @param {number} quantity - Кількість
 * @param {string} unitType - Тип одиниці: 'liters', 'kilograms', 'pieces'
 * @returns {string} - Відформатована строка
 */
export const formatQuantity = (quantity, unitType) => {
    const unit = getUnitLabel(unitType);
    return `${quantity} ${unit}`;
};

