import HttpClient from '../http/HttpClient';
import REMOTE_HOST_NAME from "../../env/index";

export class ReminderService {
    static httpClient = new HttpClient({
        baseURL: REMOTE_HOST_NAME + "reminders",
    });

    static setAuthorizationToken(token) {
        this.httpClient.setAuthorizationToken(token);
    }

    static async getAll() {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.get("get-all");
    }

    static async add(containerId, model) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.post(`add/${containerId}`, model);
    }


    static async getById(reminderId) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.get(`get-by-id/${reminderId}`);
    }

    static async update(reminderId, model) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.put(`update/${reminderId}`, model);
    }

    static async delete(reminderId) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.delete(`delete/${reminderId}`);
    }

}
