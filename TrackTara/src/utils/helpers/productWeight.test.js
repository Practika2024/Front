import { describe, it, expect } from "vitest";
import { lineTotalWeightKg, formatWeightKg } from "./productWeight";

describe("productWeight", () => {
  it("lineTotalWeightKg множить кількість на вагу одиниці", () => {
    expect(lineTotalWeightKg(10, 1.03)).toBeCloseTo(10.3);
    expect(lineTotalWeightKg(0, 5)).toBe(0);
  });

  it("ігнорує некоректну вагу", () => {
    expect(lineTotalWeightKg(10, NaN)).toBe(0);
    expect(lineTotalWeightKg(10, -1)).toBe(0);
  });

  it("formatWeightKg форматує кілограми", () => {
    expect(formatWeightKg(3.456)).toBe("3.46 кг");
    expect(formatWeightKg(NaN)).toBe("—");
  });
});
