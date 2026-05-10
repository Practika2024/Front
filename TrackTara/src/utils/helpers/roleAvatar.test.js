import { describe, it, expect } from "vitest";
import { getRoleBadge, rolesFromUserRecord, toRoleArray } from "./roleAvatar";
import { APP_ROLES } from "./userRoles";

describe("roleAvatar", () => {
  it("toRoleArray приймає рядок і масив", () => {
    expect(toRoleArray("Operator")).toEqual(["Operator"]);
    expect(toRoleArray(["Administrator", "User"])).toEqual(["Administrator", "User"]);
    expect(toRoleArray(null)).toEqual([]);
  });

  it("rolesFromUserRecord з об'єктів roles[].name", () => {
    expect(
      rolesFromUserRecord({
        role: "Operator",
        roles: [{ name: "Administrator" }],
      }),
    ).toEqual(["Administrator"]);
  });

  it("getRoleBadge: адмін, оператор, sales, очікування ролі", () => {
    expect(getRoleBadge([APP_ROLES.Administrator]).emoji).toBe("🧑‍💼");
    expect(getRoleBadge([APP_ROLES.Operator]).emoji).toBe("👷");
    expect(getRoleBadge([APP_ROLES.SalesManager]).emoji).toBe("💼");
    expect(getRoleBadge([APP_ROLES.Guest]).emoji).toBe("❓");
    expect(getRoleBadge([]).emoji).toBe("❓");
  });
});
