import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { validateCartNumber, getAllCarts } from "./CartRegistryService";

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
    BASE_URLS: { CART_REGISTRY: "http://localhost/carts" },
  },
}));

vi.mock("./mock/MockCartRegistry", () => ({
  validateCartNumber: vi.fn().mockResolvedValue(true),
  getAllCarts: vi.fn().mockResolvedValue(["Z999"]),
}));

describe("CartRegistryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validateCartNumber: API повертає true", async () => {
    axios.get.mockResolvedValueOnce({ data: true });
    await expect(validateCartNumber("A123")).resolves.toBe(true);
  });

  it("validateCartNumber: fallback на мок при 404", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    await expect(validateCartNumber("A123")).resolves.toBe(true);
  });

  it("getAllCarts: успіх API", async () => {
    axios.get.mockResolvedValueOnce({ data: ["A001", "B002"] });
    await expect(getAllCarts()).resolves.toEqual(["A001", "B002"]);
  });
});
