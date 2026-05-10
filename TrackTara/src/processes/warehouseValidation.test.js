import { describe, it, expect } from "vitest";

/**
 * Узгоджено з CartRegistry / HomePage: номер візка після нормалізації.
 */
const CART_RE = /^[A-Z]\d{3}$/;

function normalizeCartNumber(s) {
  return String(s || "").trim().toUpperCase();
}

describe("warehouse processes — формат номера візка", () => {
  it.each([
    ["A123", true],
    ["b456", true],
    ["  c789 ", true],
    ["AA12", false],
    ["A12", false],
    ["1234", false],
    ["", false],
  ])("normalizeCartNumber(%s) валідність %s", (raw, ok) => {
    const n = normalizeCartNumber(raw);
    expect(CART_RE.test(n)).toBe(ok);
  });
});

describe("warehouse processes — коди контейнера для видачі", () => {
  it("очікуваний патерн A01-CNT-001", () => {
    expect(/^[A-Z]\d{2}-CNT-\d+$/.test("A01-CNT-001")).toBe(true);
  });
});
