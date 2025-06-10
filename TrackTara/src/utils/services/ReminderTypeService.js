import axios from 'axios';
import REMOTE_HOST_NAME from "../../env/index";

const baseURL = REMOTE_HOST_NAME + "reminders-type";

class ReminderTypeService {
    static async getAll(page, pageSize) {
        const token = localStorage.getItem("accessToken");
        const params = {};
        if (page && pageSize) {
            params.page = page;
            params.pageSize = pageSize;
        }
        const response = await axios.get(`${baseURL}/get-all`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        });
        return response.data;
    }

    static async getById(typeId) {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseURL}/get-by-id/${typeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        });
        return response.data;
    }

    static async add(model) {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(`${baseURL}/add`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        });
        return response.data;
    }

    static async update(typeId, model) {
        const token = localStorage.getItem("accessToken");
        const response = await axios.put(`${baseURL}/update/${typeId}`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        });
        return response.data;
    }

    static async delete(typeId) {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(`${baseURL}/delete/${typeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        });
        return response.data;
    }
}

export { ReminderTypeService }; 