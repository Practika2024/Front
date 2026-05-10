import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getAllPackingBoxes, createPackingBox } from "./PackingBoxService";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../config/apiConfig", () => ({
  API_CONFIG: {
    USE_MOCK_API: false,
    BASE_URLS: { PACKING_BOXES: "http://localhost/boxes" },
  },
}));

vi.mock("./mock/MockPackingBoxService", () => ({
  getAllPackingBoxes: vi.fn().mockResolvedValue([{ id: 1, boxCode: "MOCK" }]),
  createPackingBox: vi.fn().mockResolvedValue({ id: 2 }),
  deletePackingBox: vi.fn(),
  addToPackingBox: vi.fn(),
  transferPackingBoxContent: vi.fn(),
}));

describe("PackingBoxService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllPackingBoxes: успіх API", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 10 }] });
    await expect(getAllPackingBoxes()).resolves.toEqual([{ id: 10 }]);
  });

  it("getAllPackingBoxes: fallback при мережевій помилці", async () => {
    axios.get.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    await expect(getAllPackingBoxes()).resolves.toEqual([{ id: 1, boxCode: "MOCK" }]);
  });

  it("createPackingBox: POST та повернення data", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 5 } });
    await expect(createPackingBox({ clientName: "X", orderId: 1 })).resolves.toEqual({ id: 5 });
  });
});
