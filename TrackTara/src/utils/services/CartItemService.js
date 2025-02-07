import HttpClient from "../http/HttpClient";

export class CartItemService {
  static httpClient = new HttpClient({
    baseURL: "http://13.60.245.135:4312/cart-items",
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
