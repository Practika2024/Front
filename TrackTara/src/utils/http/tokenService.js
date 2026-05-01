import { jwtDecode } from "jwt-decode";
import { store } from "../../store/store";
import { authUser } from "./../../store/state/reduserSlises/userSlice";
import { logoutUser } from "../../store/state/actions/userActions";
import { normalizeUserPayloadForAuth } from "../helpers/userRoles";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export const refreshToken = async (originalRequest, setAuthorizationToken) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      if (token == null || token === "") {
        return Promise.reject(new Error("Refresh queue: empty token"));
      }
      originalRequest.headers["Authorization"] = `Bearer ${token}`;
      setAuthorizationToken(token);
      return token;
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    // Використовуємо AuthService для refresh token (він автоматично вибере між моком та реальним API)
    const { AuthService } = await import('../services');
    const tokens = await AuthService.refreshToken({ refreshToken, accessToken });

    if (tokens && tokens.accessToken) {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      setAuthorizationToken(tokens.accessToken);

      const decoded = jwtDecode(tokens.accessToken);
      const user = normalizeUserPayloadForAuth(decoded);
      store.dispatch(authUser(user));

      processQueue(null, tokens.accessToken);
      return tokens.accessToken;
    } else {
      throw new Error("Failed to refresh tokens");
    }
  } catch (refreshError) {
    processQueue(refreshError, null);
    await logoutUser()(store.dispatch);
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};
