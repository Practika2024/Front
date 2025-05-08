import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { store } from "../../store/store";
import { authUser } from "./../../store/state/reduserSlises/userSlice";
import { logoutUser } from "../../store/state/actions/userActions";
import REMOTE_HOST_NAME from "../../env/index";

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
    })
      .then((token) => {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axios(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    const { data } = await axios.post(
      `${REMOTE_HOST_NAME}account/refresh-token`,
      { refreshToken, accessToken }
    );

    const tokens = data.payload;

    if (tokens) {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      setAuthorizationToken(tokens.accessToken);

      const user = jwtDecode(tokens.accessToken);
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
