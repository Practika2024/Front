import {
  APP_ROLES,
  isAwaitingRoleAssignment,
  normalizeRoleName,
} from "./userRoles";

/**
 * Нормалізує поле ролі з запису користувача (API / мок) до string[].
 */
export function toRoleArray(roles) {
  if (roles == null) return [];
  if (Array.isArray(roles)) {
    return roles
      .map((r) => (typeof r === "object" && r != null ? r.name : r))
      .filter(Boolean)
      .map((s) => String(s).trim())
      .filter(Boolean);
  }
  const s = String(roles).trim();
  return s ? [s] : [];
}

export function rolesFromUserRecord(user) {
  if (!user) return [];
  if (Array.isArray(user.roles) && user.roles.length) {
    if (typeof user.roles[0] === "object") {
      return toRoleArray(user.roles.map((r) => r?.name).filter(Boolean));
    }
    return toRoleArray(user.roles);
  }
  return toRoleArray(user.role);
}

/**
 * Канонічні ролі для відображення позначки (пріоритет: адмін → оператор → sales → user).
 */
function canonicalRolesForBadge(roles) {
  const raw = toRoleArray(roles);
  const set = new Set();
  for (const r of raw) {
    const n = normalizeRoleName(r);
    if (n) set.add(n);
  }
  return [...set];
}

/**
 * @returns {{ emoji: string, label: string }}
 */
export function getRoleBadge(roles) {
  const canon = canonicalRolesForBadge(roles);

  if (!canon.length) {
    return { emoji: "❓", label: "Роль не визначена" };
  }

  if (isAwaitingRoleAssignment(canon)) {
    return { emoji: "❓", label: "Очікує призначення ролі" };
  }

  if (canon.includes(APP_ROLES.Administrator)) {
    return { emoji: "🧑‍💼", label: "Адміністратор" };
  }
  if (canon.includes(APP_ROLES.Operator)) {
    return { emoji: "👷", label: "Оператор" };
  }
  if (canon.includes(APP_ROLES.SalesManager)) {
    return { emoji: "💼", label: "Sales-менеджер" };
  }
  if (canon.includes(APP_ROLES.Guest)) {
    return { emoji: "❓", label: "Гість" };
  }

  return { emoji: "❓", label: "Невідома роль" };
}
