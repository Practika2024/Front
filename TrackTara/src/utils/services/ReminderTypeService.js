import HttpClient from '../http/HttpClient';
import REMOTE_HOST_NAME from "../../env/index";

export class ReminderTypeService {
    static httpClient = new HttpClient({
        baseURL: REMOTE_HOST_NAME + "reminders-type",
    });

    static setAuthorizationToken(token) {
        this.httpClient.setAuthorizationToken(token);
    }

    static async getAll() {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.get("get-all");
    }

    static async getById(typeId) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.get(`get-by-id/${typeId}`);
    }

    static async add(model) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.post("add", model);
    }

    static async update(typeId, model) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.put(`update/${typeId}`, model);
    }

    static async delete(typeId) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.delete(`delete/${typeId}`);
    }
} 