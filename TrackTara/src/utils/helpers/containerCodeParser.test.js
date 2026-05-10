import { describe, it, expect } from "vitest";
import {
  extractSectorFromCode,
  extractRowFromCode,
  extractContainerNumberFromCode,
  isValidContainerCode,
  parseContainerCode,
} from "./containerCodeParser";

describe("containerCodeParser", () => {
  const code = "A01-CNT-001";

  it("extractSectorFromCode", () => {
    expect(extractSectorFromCode(code)).toBe("A");
    expect(extractSectorFromCode("")).toBeNull();
  });

  it("extractRowFromCode", () => {
    expect(extractRowFromCode(code)).toBe(1);
  });

  it("extractContainerNumberFromCode", () => {
    expect(extractContainerNumberFromCode(code)).toBe("001");
  });

  it("isValidContainerCode", () => {
    expect(isValidContainerCode(code)).toBe(true);
    expect(isValidContainerCode("bad")).toBe(false);
  });

  it("parseContainerCode", () => {
    expect(parseContainerCode(code)).toEqual({ sector: "A", rowNumber: 1 });
    expect(parseContainerCode("x")).toBeNull();
  });
});
