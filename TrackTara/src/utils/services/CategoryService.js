import HttpClient from "../http/HttpClient";
import { API_CONFIG } from "../config/apiConfig";

export class CategoryService {
  static httpClient = new HttpClient({
    baseURL: API_CONFIG.BASE_URLS.CATEGORIES,
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async getCategories() {
    return await this.httpClient.get("get-all");
  }
}
