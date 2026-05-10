import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

const base = () => String(API_CONFIG.BASE_URLS.SECTORS || "").replace(/\/$/, "");

const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const normalizeSector = (s) => ({
  sector: String(s.sector ?? s.name ?? "").toUpperCase(),
  rows: Array.isArray(s.rows) ? [...s.rows].map((n) => parseInt(n, 10)).filter((x) => !Number.isNaN(x)) : [],
});

/**
 * Реальний API секторів (очікувані маршрути узгоджені з типовими контролерами проєкту).
 * Якщо бекенд ще не реалізований — увімкніть моки або додайте контролер під ці шляхи.
 */
export const SectorService = {
  async getAllSectors() {
    const { data } = await axios.get(`${base()}/get-all`, authHeaders());
    const list = Array.isArray(data) ? data : [];
    return list.map(normalizeSector);
  },

  async getSector(sectorName) {
    const all = await this.getAllSectors();
    return all.find((s) => s.sector === sectorName.toUpperCase()) ?? null;
  },

  async createSector(sectorName) {
    const sector = sectorName.trim().toUpperCase();
    const { data } = await axios.post(`${base()}/create`, { sector }, authHeaders());
    return normalizeSector(data);
  },

  async deleteSector(sectorName) {
    await axios.delete(
      `${base()}/delete/${encodeURIComponent(sectorName.toUpperCase())}`,
      authHeaders(),
    );
    return { success: true };
  },

  async addRowToSector(sectorName, rowNumber) {
    const row = parseInt(rowNumber, 10);
    const res = await axios.put(
      `${base()}/add-row`,
      { sector: sectorName.toUpperCase(), rowNumber: row },
      authHeaders(),
    );
    if (res.data) return normalizeSector(res.data);
    const all = await this.getAllSectors();
    return (
      all.find((x) => x.sector === sectorName.toUpperCase()) ??
      normalizeSector({ sector: sectorName, rows: [] })
    );
  },

  async removeRowFromSector(sectorName, rowNumber) {
    const row = parseInt(rowNumber, 10);
    const res = await axios.delete(
      `${base()}/remove-row/${encodeURIComponent(sectorName.toUpperCase())}/${row}`,
      authHeaders(),
    );
    if (res.data) return normalizeSector(res.data);
    const all = await this.getAllSectors();
    return (
      all.find((x) => x.sector === sectorName.toUpperCase()) ??
      normalizeSector({ sector: sectorName, rows: [] })
    );
  },

  async sectorExists(sectorName) {
    const all = await this.getAllSectors();
    return all.some((s) => s.sector === sectorName.toUpperCase());
  },

  async rowExistsInSector(sectorName, rowNumber) {
    const all = await this.getAllSectors();
    const s = all.find((x) => x.sector === sectorName.toUpperCase());
    if (!s) return false;
    return s.rows.includes(parseInt(rowNumber, 10));
  },
};
