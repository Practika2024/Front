// src/utils/services/TareService.js
import HttpClient from '../http/HttpClient';

export class TareService {
    static httpClient = new HttpClient({
        baseURL: 'http://localhost:5081/containers',
    });

    static setAuthorizationToken(token) {
        this.httpClient.setAuthorizationToken(token);
    }

    static async getTares() {
        return await this.httpClient.get('all');
    }
}