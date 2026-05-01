import { Navigate } from "react-router-dom";
import ErrorMessage from "../components/layout/ErrorMessage";
import { jwtDecode } from "jwt-decode";
import {
  APP_ROLES,
  getNormalizedRolesFromAccessToken,
  isAwaitingRoleAssignment,
  isRoleAllowed,
} from "../utils/helpers/userRoles";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  let user = null;
  try {
    user = token ? jwtDecode(token) : null;
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = getNormalizedRolesFromAccessToken(token);

  if (
    isAwaitingRoleAssignment(userRoles) &&
    !allowedRoles.includes(APP_ROLES.Guest)
  ) {
    return <Navigate to="/pending-role" replace />;
  }

  const isAuthorized = isRoleAllowed(userRoles, allowedRoles);

  return (
    <>
      {isAuthorized ? (
        children
      ) : (
        <ErrorMessage error="Немає доступу до цього розділу. Зверніться до адміністратора." />
      )}
    </>
  );
};

export default ProtectedRoute;