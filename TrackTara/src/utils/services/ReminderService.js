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
        const res = await this.httpClient.get("get-all");
        console.log('ReminderService.getAll', res);
        return res;
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

    static async getAllByUser() {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        const res = await this.httpClient.get("get-all-by-user");
        console.log('ReminderService.getAllByUser', res);
        return res;
    }

    static async getNotCompletedByUser() {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        const res = await this.httpClient.get("get-not-completed-by-user");
        console.log('ReminderService.getNotCompletedByUser', res);
        return res;
    }

    static async getAllCompletedByUser() {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        const res = await this.httpClient.get("get-all-completed-by-user");
        console.log('ReminderService.getAllCompletedByUser', res);
        return res;
    }

    static async getNotViewedByUser() {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        const res = await this.httpClient.get("get-not-viewed-by-user");
        console.log('ReminderService.getNotViewedByUser', res);
        return res;
    }

    // --- Типи нагадувань ---
    static async getAllTypes() {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.get("/reminders-type/get-all");
    }

    static async addType(model) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.post("/reminders-type/add", model);
    }

    static async updateType(typeId, model) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.put(`/reminders-type/update/${typeId}`, model);
    }

    static async deleteType(typeId) {
        this.setAuthorizationToken(localStorage.getItem("accessToken"));
        return await this.httpClient.delete(`/reminders-type/delete/${typeId}`);
    }

}
