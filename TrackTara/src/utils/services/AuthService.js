import HttpClient from "../http/HttpClient";
import REMOTE_HOST_NAME from "../../env/index";

export class AuthService {
  static httpClient = new HttpClient({
    baseURL: REMOTE_HOST_NAME + "account",
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async signIn(model) {
    return await this.httpClient.post("signin", model);
  }

  static async externalLogin(model) {
    return await this.httpClient.post("external-login", model);
  }

  static async signUp(model) {
    try {
      return await this.httpClient.post("signup", model);
    } catch (error) {
      console.error("SignUp error:", error);
      return {
        success: false,
        message: error.response?.data || "Unknown error",
      };
    }
  }

  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("Refresh token is missing");
      }

      const response = await this.httpClient.post("refresh-token", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Зберігаємо нові токени
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      this.setAuthorizationToken(accessToken);

      return accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }
}