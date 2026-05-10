import { describe, it, expect } from "vitest";
import { getNavSections, getMobileDockItems, getHomePath } from "./warehouseNav";

describe("warehouseNav", () => {
  describe("getNavSections", () => {
    it("Administrator бачить склад, продажі та адмін", () => {
      const sections = getNavSections(["Administrator"]);
      const ids = sections.map((s) => s.id);
      expect(ids).toContain("warehouse");
      expect(ids).toContain("sales");
      expect(ids).toContain("admin");
      const admin = sections.find((s) => s.id === "admin");
      expect(admin.items.some((i) => i.to === "/admin/dashboard")).toBe(true);
    });

    it("лише SalesManager: продажі + каталог, без складу", () => {
      const sections = getNavSections(["SalesManager"]);
      expect(sections.find((s) => s.id === "warehouse")).toBeUndefined();
      const sales = sections.find((s) => s.id === "sales");
      expect(sales.items.some((i) => i.to === "/products")).toBe(true);
    });

    it("Operator: склад без адміна", () => {
      const sections = getNavSections(["Operator"]);
      expect(sections.find((s) => s.id === "warehouse")).toBeDefined();
      expect(sections.find((s) => s.id === "admin")).toBeUndefined();
    });
  });

  describe("getMobileDockItems", () => {
    it("onlySales → три продажові кнопки", () => {
      const dock = getMobileDockItems(["SalesManager"]);
      expect(dock.map((d) => d.to)).toEqual(["/sales", "/sales/clients", "/orders/create"]);
    });

    it("Operator → старт, збір, коробки", () => {
      const dock = getMobileDockItems(["Operator"]);
      expect(dock.some((d) => d.to === "/warehouse/pick")).toBe(true);
    });
  });

  describe("getHomePath", () => {
    it("Guest без робочих ролей → pending-role", () => {
      expect(getHomePath(["Guest"])).toBe("/pending-role");
    });

    it("onlySales → /sales", () => {
      expect(getHomePath(["SalesManager"])).toBe("/sales");
    });

    it("Operator → /", () => {
      expect(getHomePath(["Operator"])).toBe("/");
    });
  });
});
