import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/layout/ErrorMessage";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const user = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const userRoles = user
      ? Array.isArray(user.role)
          ? user.role
          : [user.role]
      : [];
  const isAuthorized = allowedRoles.some((role) => userRoles.includes(role) || userRoles.includes("Administrator"));

  return (
      <>{isAuthorized ? children : <ErrorMessage error="Unauthorized user" />}</>
  );
};

export default ProtectedRoute;