import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/layout/ErrorMessage";
import { jwtDecode } from "jwt-decode";
import {
  getNormalizedRolesFromAccessToken,
  isRoleAllowed,
} from "../utils/helpers/userRoles";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  let user = null;
  try {
    user = token ? jwtDecode(token) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const userRoles = getNormalizedRolesFromAccessToken(token);
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