import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AuthByToken } from "../store/state/actions/userActions";
import { logout } from "../store/state/reduserSlises/userSlice";

/**
 * Після rehydrate з localStorage: відновити сесію з JWT або скинути user, якщо токенів немає.
 */
export default function BootstrapAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (access && refresh) {
      AuthByToken({
        accessToken: access,
        refreshToken: refresh,
      })(dispatch).catch((error) => {
        console.error("Error during token authentication:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
      });
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return null;
}
