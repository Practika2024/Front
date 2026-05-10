import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getAllBrakiMagItems } from "./BrakiMagService";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock("../config/apiConfig", () => ({
  API_CONFIG: {
    USE_MOCK_API: false,
    BASE_URLS: { BRAKIMAG: "http://localhost/brakimag" },
  },
}));

vi.mock("./mock/MockBrakiMagService", () => ({
  getAllBrakiMagItems: vi.fn().mockResolvedValue([{ id: 99, reason: "mock-fallback" }]),
}));

describe("BrakiMagService (real mode + fallback)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("при 404 від API повертає дані мока", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    const rows = await getAllBrakiMagItems();
    expect(rows).toEqual([{ id: 99, reason: "mock-fallback" }]);
    expect(axios.get).toHaveBeenCalled();
  });

  it("при успіху API повертає масив з сервера", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    const rows = await getAllBrakiMagItems();
    expect(rows).toEqual([{ id: 1 }]);
  });
});
