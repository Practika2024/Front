import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getNormalizedRolesFromAccessToken } from "../utils/helpers/userRoles";

/**
 * Ролі для UI: спочатку з JWT (те саме джерело, що ProtectedRoute / RoleHomeRedirect),
 * інакше з Redux — щоб не було роз’їзду «на іншому заході» між меню й маршрутами.
 */
export default function useAppRoles() {
  const currentUser = useSelector((s) => s.user.currentUser);

  return useMemo(() => {
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const fromToken = token ? getNormalizedRolesFromAccessToken(token) : [];
    if (fromToken.length > 0) {
      return fromToken;
    }

    if (currentUser?.role != null) {
      const r = currentUser.role;
      return Array.isArray(r) ? r.filter(Boolean) : [r].filter(Boolean);
    }
    return [];
  }, [currentUser]);
}
