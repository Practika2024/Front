import HttpClient from "../http/HttpClient";
import  REMOTE_HOST_NAME  from "../../env/index";
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
    console.log(this.httpClient);
    
    return await this.httpClient.post("externalLogin", model);
  }

  static async signUp(model) {
    try {
      return await this.httpClient.post("signup", model);
    } catch (error) {
      console.error("SignUp error:", error);
      return { success: false, message: error.response?.data || "Unknown error" };
    }
  }


  static async refreshToken(model) {
    return await this.httpClient.post("refresh-token", model);
  }
}
