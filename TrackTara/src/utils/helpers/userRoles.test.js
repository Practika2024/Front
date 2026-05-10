import { describe, it, expect } from "vitest";
import {
  APP_ROLES,
  extractRawRolesFromPayload,
  normalizeRoleName,
  isAwaitingRoleAssignment,
  getNormalizedRolesFromJwtPayload,
  getNormalizedRolesFromAccessToken,
  isRoleAllowed,
} from "./userRoles";
import { makeAccessToken } from "../../test/jwtTestUtils";

describe("userRoles", () => {
  describe("extractRawRolesFromPayload", () => {
    it("збирає role, roles та .NET claim", () => {
      const payload = {
        role: "Operator",
        roles: ["SalesManager"],
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Administrator",
      };
      const raw = extractRawRolesFromPayload(payload);
      expect(raw).toContain("Operator");
      expect(raw).toContain("SalesManager");
      expect(raw).toContain("Administrator");
    });

    it("повертає порожній масив для некоректного payload", () => {
      expect(extractRawRolesFromPayload(null)).toEqual([]);
      expect(extractRawRolesFromPayload(undefined)).toEqual([]);
    });
  });

  describe("normalizeRoleName", () => {
    it("канонізує відомі ролі", () => {
      expect(normalizeRoleName("admin")).toBe(APP_ROLES.Administrator);
      expect(normalizeRoleName("ADMINISTRATOR")).toBe(APP_ROLES.Administrator);
      expect(normalizeRoleName("sales manager")).toBe(APP_ROLES.SalesManager);
    });

    it("повертає null для невідомого", () => {
      expect(normalizeRoleName("UnknownRole")).toBeNull();
      expect(normalizeRoleName("")).toBeNull();
    });
  });

  describe("isAwaitingRoleAssignment", () => {
    it("true лише Guest без робочих ролей", () => {
      expect(isAwaitingRoleAssignment([APP_ROLES.Guest])).toBe(true);
      expect(isAwaitingRoleAssignment([APP_ROLES.Guest, APP_ROLES.Operator])).toBe(false);
      expect(isAwaitingRoleAssignment([APP_ROLES.Operator])).toBe(false);
    });
  });

  describe("getNormalizedRolesFromJwtPayload", () => {
    it("дедуплікує та нормалізує", () => {
      const roles = getNormalizedRolesFromJwtPayload({
        roles: ["admin", "Administrator", "operator"],
      });
      expect(roles).toContain(APP_ROLES.Administrator);
      expect(roles).toContain(APP_ROLES.Operator);
      expect(roles.filter((r) => r === APP_ROLES.Administrator).length).toBe(1);
    });
  });

  describe("getNormalizedRolesFromAccessToken", () => {
    it("читає ролі з токена", () => {
      const token = makeAccessToken({ role: ["Operator"] });
      expect(getNormalizedRolesFromAccessToken(token)).toContain(APP_ROLES.Operator);
    });

    it("повертає [] при невалідному JWT", () => {
      expect(getNormalizedRolesFromAccessToken("not-a-jwt")).toEqual([]);
    });
  });

  describe("isRoleAllowed", () => {
    it("Administrator має доступ скрізь", () => {
      expect(isRoleAllowed([APP_ROLES.Administrator], ["Operator"])).toBe(true);
    });

    it("Operator не проходить на чисто admin-маршрут", () => {
      expect(isRoleAllowed([APP_ROLES.Operator], [APP_ROLES.Administrator])).toBe(false);
    });

    it("SalesManager проходить якщо дозволено", () => {
      expect(
        isRoleAllowed([APP_ROLES.SalesManager], [APP_ROLES.SalesManager, APP_ROLES.Administrator]),
      ).toBe(true);
    });
  });
});
