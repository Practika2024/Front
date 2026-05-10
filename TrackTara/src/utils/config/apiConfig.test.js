import { describe, it, expect, vi, afterEach } from "vitest";

describe("apiConfig USE_MOCK_API", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("за замовчуванням моки увімкнені (якщо змінна не 'false')", async () => {
    vi.stubEnv("VITE_USE_MOCK_API", "true");
    vi.resetModules();
    const { API_CONFIG } = await import("./apiConfig.js");
    expect(API_CONFIG.USE_MOCK_API).toBe(true);
  });

  it("VITE_USE_MOCK_API=false вимикає глобальні моки", async () => {
    vi.stubEnv("VITE_USE_MOCK_API", "false");
    vi.resetModules();
    const { API_CONFIG } = await import("./apiConfig.js");
    expect(API_CONFIG.USE_MOCK_API).toBe(false);
  });
});
