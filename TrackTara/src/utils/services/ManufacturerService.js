import HttpClient from "../http/HttpClient";

export class ManufacturerService {
  static httpClient = new HttpClient({
    // baseURL: "http://localhost:4312/manufacturers",
    baseURL: "http://13.60.245.135:4312/manufacturers",
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
