import HttpClient from "../http/HttpClient";
import { API_CONFIG } from "../config/apiConfig";

export class CartItemService {
  static httpClient = new HttpClient({
    baseURL: API_CONFIG.BASE_URLS.CART_ITEMS,
  });

  static setAuthorizationToken(token) {
    this.httpClient.setAuthorizationToken(token);
  }

  static async getAllCartItems() {
    return await this.httpClient.get("get-all");
  }

  static async getCartItemById(cartItemId) {
    return await this.httpClient.get(`get-by-id/${cartItemId}`);
  }

  static async getCartItemsByUserId(userId) {
    return await this.httpClient.get(`get-by-user-id/${userId}`);
  }

  static async createCartItem(cartItem) {
    return await this.httpClient.post("create", cartItem);
  }

  static async updateCartItemQuantity(cartItemId, quantity) {
    return await this.httpClient.put(
      `update-quantity/${cartItemId}?quantity=${quantity}`
    );
  }

  static async deleteCartItem(cartItemId) {
    return await this.httpClient.delete(`delete/${cartItemId}`);
  }
}
