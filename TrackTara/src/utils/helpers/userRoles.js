import { jwtDecode } from "jwt-decode";

/** Канонічні ролі в UI та маршрутах */
export const APP_ROLES = {
  Administrator: "Administrator",
  Operator: "Operator",
  SalesManager: "SalesManager",
  /** Обліковий запис без робочих прав — очікує призначення ролі адміністратором */
  Guest: "Guest",
};

const CLAIM_ROLE =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const CANONICAL_ORDER = [
  "Administrator",
  "Operator",
  "SalesManager",
  "Guest",
];

/**
 * Витягує сирі рядки ролей з типового JWT (role / roles / .NET claim).
 */
export function extractRawRolesFromPayload(payload) {
  if (!payload || typeof payload !== "object") return [];
  const out = [];

  const push = (v) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((x) => push(x));
    } else {
      out.push(String(v).trim());
    }
  };

  push(payload[CLAIM_ROLE]);
  push(payload.roles);
  push(payload.role);

  return out.filter(Boolean);
}

/**
 * Мапить довільний рядок з бекенду на канонічну роль додатку.
 */
export function normalizeRoleName(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  if (!s) return null;

  const byCanon = CANONICAL_ORDER.find((c) => c.toLowerCase() === s.toLowerCase());
  if (byCanon) return byCanon;

  const compact = s.toLowerCase().replace(/[\s_\-]+/g, "");
  const aliases = {
    admin: APP_ROLES.Administrator,
    administrator: APP_ROLES.Administrator,
    operator: APP_ROLES.Operator,
    salesmanager: APP_ROLES.SalesManager,
    /**
     * Легасі-роль "User" зі старої версії продукту: ніяких прав у TrackTara
     * вона не дає, тому мапимо на Guest — адмін одразу побачить такого юзера
     * у списку «очікують ролі» і призначить реальну.
     */
    user: APP_ROLES.Guest,
    guest: APP_ROLES.Guest,
  };
  return aliases[compact] || null;
}

/**
 * Користувач у статусі «гість»: є лише роль Guest, без складських/продажних прав.
 */
export function isAwaitingRoleAssignment(userRoles) {
  if (!Array.isArray(userRoles) || userRoles.length === 0) return false;
  const hasWorkRole = userRoles.some((r) =>
    [APP_ROLES.Operator, APP_ROLES.Administrator, APP_ROLES.SalesManager].includes(
      r
    )
  );
  return userRoles.includes(APP_ROLES.Guest) && !hasWorkRole;
}

/**
 * Унікальні канонічні ролі з payload JWT.
 */
export function getNormalizedRolesFromJwtPayload(payload) {
  const raw = extractRawRolesFromPayload(payload);
  const set = new Set();
  for (const r of raw) {
    const n = normalizeRoleName(r);
    if (n) set.add(n);
  }
  return [...set];
}

/**
 * Об'єкт користувача для Redux: поле role завжди string[] (навіть одна роль).
 */
export function normalizeUserPayloadForAuth(decoded) {
  const roles = getNormalizedRolesFromJwtPayload(decoded);
  return {
    ...decoded,
    role: roles,
  };
}

/**
 * Ролі з accessToken у localStorage (для ProtectedRoute до оновлення Redux).
 */
export function getNormalizedRolesFromAccessToken(token) {
  if (!token || typeof token !== "string") return [];
  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch {
    return [];
  }
  return getNormalizedRolesFromJwtPayload(decoded);
}

/**
 * Чи дозволено вхід на маршрут зі списком allowedRoles (адмін — повний доступ).
 */
export function isRoleAllowed(userRoles, allowedRoles) {
  if (!Array.isArray(userRoles) || !userRoles.length) return false;
  if (userRoles.includes(APP_ROLES.Administrator)) return true;
  return allowedRoles.some((r) => userRoles.includes(r));
}
