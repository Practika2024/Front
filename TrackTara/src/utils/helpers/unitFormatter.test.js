import { describe, it, expect } from "vitest";
import { getUnitLabel, getUnitFullLabel, formatQuantity } from "./unitFormatter";

describe("unitFormatter", () => {
  it("getUnitLabel", () => {
    expect(getUnitLabel("liters")).toBe("л");
    expect(getUnitLabel("kilograms")).toBe("кг");
    expect(getUnitLabel("pieces")).toBe("шт");
    expect(getUnitLabel("unknown")).toBe("л/кг");
  });

  it("getUnitFullLabel", () => {
    expect(getUnitFullLabel("pieces")).toBe("штуки");
  });

  it("formatQuantity", () => {
    expect(formatQuantity(5, "liters")).toBe("5 л");
  });
});
