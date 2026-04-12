import { Navigate } from "react-router-dom";
import WarehouseHub from "../pages/hub/WarehouseHub";
import useAppRoles from "../hooks/useAppRoles";

/**
 * Чистий sales → одразу панель продажів; інші ролі → стартова панель робіт (не екран видавки).
 */
const RoleHomeRedirect = () => {
  const roles = useAppRoles();
  const onlySales =
    roles.includes("SalesManager") &&
    !roles.includes("Operator") &&
    !roles.includes("Administrator");
  if (onlySales) return <Navigate to="/sales" replace />;
  return <WarehouseHub />;
};
export default RoleHomeRedirect;
