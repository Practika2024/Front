import HttpClient from '../http/HttpClient';
import  REMOTE_HOST_NAME  from "../../env/index";

export class UserService {
  static httpClient = new HttpClient({
    baseURL: REMOTE_HOST_NAME + "users",
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
    return await this.httpClient.put(`update-role/${userId}`, roles);
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

  static async createUser(model) {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    try {
      return await this.httpClient.post("create", model);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return { success: false, message: "User already exists." };
      }
      throw error;
    }
  }
}