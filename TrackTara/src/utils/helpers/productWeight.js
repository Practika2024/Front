/**
 * Вага для логістики: weightKg — маса в кілограмах на одну одиницю кількості
 * (1 л, 1 шт, 1 кг залежно від unitType позиції).
 */
export function lineTotalWeightKg(quantity, weightKgPerUnit) {
  const q = Number(quantity) || 0;
  const w = Number(weightKgPerUnit);
  if (!Number.isFinite(w) || w < 0) return 0;
  return q * w;
}

export function formatWeightKg(kg, fractionDigits = 2) {
  const n = Number(kg);
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(fractionDigits)} кг`;
}
