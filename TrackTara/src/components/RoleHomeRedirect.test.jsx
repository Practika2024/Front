import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RoleHomeRedirect from "./RoleHomeRedirect";

vi.mock("../hooks/useAppRoles", () => ({
  default: vi.fn(),
}));

import useAppRoles from "../hooks/useAppRoles";

describe("RoleHomeRedirect", () => {
  it("only SalesManager → Navigate /sales", () => {
    useAppRoles.mockReturnValue(["SalesManager"]);
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RoleHomeRedirect />} />
          <Route path="/sales" element={<div data-testid="sales">sales</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId("sales")).toBeInTheDocument();
  });

  it("Operator → WarehouseHub (стартова панель)", async () => {
    useAppRoles.mockReturnValue(["Operator"]);
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RoleHomeRedirect />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/Робоча панель/i)).toBeInTheDocument();
  });
});
