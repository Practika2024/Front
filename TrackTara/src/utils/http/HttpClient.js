import axios from "axios";
import {
  setIsLoading
} from "../../store/state/actions/appSettingActions";
import { store } from "../../store/store";

export default class HttpClient {
  constructor(configs) {
    this.axiosInstance = axios.create({
      baseURL: configs.baseURL,
      timeout: configs.timeout || 3000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...configs.headers,
        "Access-Control-Allow-Origin": "*",
      },
      ...configs,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const token = await refreshToken(
              originalRequest,
              this.setAuthorizationToken.bind(this)
            );
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setAuthorizationToken(token) {
    if (token) {
      this.axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common["Authorization"];
    }
  }

  async get(url, config = {}) {
    return this.request({ method: "GET", url, ...config });
  }

  async post(url, data, config = {}) {
    return this.request({ method: "POST", url, data, ...config });
  }

  async put(url, data, config = {}) {
    return this.request({ method: "PUT", url, data, ...config });
  }

  async delete(url, config = {}) {
    return this.request({ method: "DELETE", url, ...config });
  }

  async request(config) {
    setIsLoading(true)(store.dispatch);
    try {
      const response = await this.axiosInstance.request(config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false)(store.dispatch);
    }
  }
}
