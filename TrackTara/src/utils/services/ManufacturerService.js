import HttpClient from "../http/HttpClient";
import { API_CONFIG } from "../config/apiConfig";

export class ManufacturerService {
  static httpClient = new HttpClient({
    baseURL: API_CONFIG.BASE_URLS.MANUFACTURERS,
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async createManufacturer(name) {
    return await this.httpClient.post("create", { name: name });
  }

  static async getManufacturers() {
    return await this.httpClient.get("get-all");
  }
  static async getManufacturersByCategoryId(categoryId) {
    return await this.httpClient.get(`get-by-category-id/${categoryId}`);
  }

  static async deleteManufacturer(id) {
    return await this.httpClient.delete(`delete/${id}`);
  }

  static async updateManufacturer(model) {
    return await this.httpClient.put("update", model);
  }
}
