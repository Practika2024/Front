import HttpClient from "../http/HttpClient";

export class CategoryService {
  static httpClient = new HttpClient({
    baseURL: "http://13.60.245.135:4312/categories",
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async getCategories() {
    return await this.httpClient.get("get-all");
  }
}
