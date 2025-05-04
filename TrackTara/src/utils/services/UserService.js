import HttpClient from '../http/HttpClient';
import REMOTE_HOST_NAME from "../../env/index";

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

  static async getUnapprovedUsers() {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    try {
      const response = await this.httpClient.get("get-all-without-approval");
      console.log("getUnapprovedUsers Response:", response); // Логування
      return response;
    } catch (error) {
      console.error("Error in getUnapprovedUsers:", error);
      throw error;
    }
  }

  static async approveUser(userId) {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    return await this.httpClient.patch(`approve/${userId}`);
  }

  static async rejectUser(userId) {
    this.setAuthorizationToken(localStorage.getItem("accessToken"));
    return await this.httpClient.delete(`reject/${userId}`);
  }
}