import { API_CONFIG } from "../config/apiConfig";

/** Заголовки для операційних endpoint (бракімаг, візки, коробки). */
export function operationalAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return { headers };
}

/** Чи увімкнено глобальний режим моків (`VITE_USE_MOCK_API` не `false`). Не React Hook. */
export function isMainMockApiEnabled() {
  return API_CONFIG.USE_MOCK_API;
}

/**
 * Якщо бекенд ще не має контролера — не ламаємо UI: повертаємось до локального сховища моків.
 * 401/403 не перехоплюємо (треба оновити сесію / права).
 */
export function shouldFallbackToLocalOperational(error) {
  if (!error?.response) return true;
  const s = error.response.status;
  if (s === 401 || s === 403) return false;
  return s === 404 || s === 405 || s === 501;
}
