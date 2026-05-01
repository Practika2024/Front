import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/state/reduserSlises/userSlice";
import { AuthByToken } from "../store/state/actions/userActions";

const AUTH_KEYS = new Set(["accessToken", "refreshToken"]);

/**
 * localStorage спільний для усіх вкладок одного origin: після логіну/логауту/refresh в іншій вкладці
 * синхронізуємо Redux, щоб не лишати «псевдо-залогіненого» стану або навпаки.
 */
export default function CrossTabAuthSync() {
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  useEffect(() => {
    const syncFromStorage = () => {
      const access = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");
      if (!access || !refresh) {
        dispatch(logout());
        return;
      }
      AuthByToken({ accessToken: access, refreshToken: refresh })(dispatch).catch(
        () => {
          dispatch(logout());
        }
      );
    };

    const onStorage = (e) => {
      if (!e.key || !AUTH_KEYS.has(e.key)) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        syncFromStorage();
      }, 0);
    };

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dispatch]);

  return null;
}
