import HttpClient from '../http/HttpClient';

export class UserService {
  static httpClient = new HttpClient({
    baseURL: "http://13.60.245.135:4312/users",
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async getUsers() {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    return await this.httpClient.get("get-all");
  }

  static async delete(userId) {
    return await this.httpClient.delete(`delete/${userId}`);
  }

  static async changeRoles(userId, roles) {
    return await this.httpClient.put(`update-roles/${userId}`, roles);
  }

  static async uploadImage(userId, file) {
    return await this.httpClient.put(`image/${userId}`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async updateUser(userId, model) {
    return await this.httpClient.put(`update/${userId}`, model);
  }

  static async getFavoriteProducts(userId) {
    return await this.httpClient.get(`get-all-favorite-products/${userId}`);
  }

  static async addFavoriteProduct(userId, productId) {
    return await this.httpClient.put(`favorite-product-add/${userId}/${productId}`);
  }

  static async removeFavoriteProduct(userId, productId) {
    return await this.httpClient.put(`favorite-product-remove/${userId}/${productId}`);
  }
}
