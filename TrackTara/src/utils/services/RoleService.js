import HttpClient from "../http/HttpClient";
import  REMOTE_HOST_NAME  from "../../env/index";

export class RoleService {
  static httpClient = new HttpClient({
    baseURL: REMOTE_HOST_NAME + "roles",
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async getRoles() {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    return await this.httpClient.get("get-all");
  }
}
