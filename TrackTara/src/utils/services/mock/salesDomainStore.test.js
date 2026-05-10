import { describe, it, expect } from "vitest";
import { normalizeRouteCode, getRouteMasterByCode } from "./salesDomainStore";

describe("salesDomainStore helpers", () => {
  it("normalizeRouteCode чистить та upper-case", () => {
    expect(normalizeRouteCode("  ac\n")).toBe("AC");
    expect(normalizeRouteCode("a-c_1")).toBe("AC1");
  });

  it("getRouteMasterByCode знаходить лінію пакування для AC", () => {
    const rm = getRouteMasterByCode("AC");
    expect(rm).not.toBeNull();
    expect(rm.packingLineCode).toContain("PACK");
    expect(Array.isArray(rm.packingTableCodes)).toBe(true);
  });
});
