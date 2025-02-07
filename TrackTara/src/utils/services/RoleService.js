import HttpClient from "../http/HttpClient";

export class RoleService {
  static httpClient = new HttpClient({
    baseURL: "http://13.60.245.135:4312/roles",
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async getRoles() {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    return await this.httpClient.get("get-all");
  }
}
