import { describe, it, expect, beforeEach } from "vitest";
import {
  operationalAuthHeaders,
  shouldFallbackToLocalOperational,
} from "./operationalApiShared";

describe("operationalApiShared", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("operationalAuthHeaders додає Bearer при наявному токені", () => {
    localStorage.setItem("accessToken", "tok");
    const h = operationalAuthHeaders();
    expect(h.headers.Authorization).toBe("Bearer tok");
    expect(h.headers["Content-Type"]).toBe("application/json");
  });

  it("shouldFallbackToLocalOperational: мережа без response → true", () => {
    expect(shouldFallbackToLocalOperational(new Error("offline"))).toBe(true);
  });

  it("shouldFallbackToLocalOperational: 401/403 → false", () => {
    expect(shouldFallbackToLocalOperational({ response: { status: 401 } })).toBe(false);
    expect(shouldFallbackToLocalOperational({ response: { status: 403 } })).toBe(false);
  });

  it("shouldFallbackToLocalOperational: 404/405/501 → true", () => {
    expect(shouldFallbackToLocalOperational({ response: { status: 404 } })).toBe(true);
    expect(shouldFallbackToLocalOperational({ response: { status: 405 } })).toBe(true);
    expect(shouldFallbackToLocalOperational({ response: { status: 501 } })).toBe(true);
  });

  it("shouldFallbackToLocalOperational: 500 → false", () => {
    expect(shouldFallbackToLocalOperational({ response: { status: 500 } })).toBe(false);
  });
});
