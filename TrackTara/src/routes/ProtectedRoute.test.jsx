import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { makeAccessToken } from "../test/jwtTestUtils";
import { APP_ROLES } from "../utils/helpers/userRoles";

function renderWithRoute(token, allowedRoles, initial = "/x") {
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");

  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route
          path="/x"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div data-testid="ok">inside</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div data-testid="login">login</div>} />
        <Route path="/pending-role" element={<div data-testid="pending">pending</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("без токена → редірект на login", () => {
    renderWithRoute(null, [APP_ROLES.Operator]);
    expect(screen.getByTestId("login")).toBeInTheDocument();
  });

  it("Guest без Guest у allowedRoles → pending-role", () => {
    const token = makeAccessToken({ role: [APP_ROLES.Guest] });
    renderWithRoute(token, [APP_ROLES.Operator]);
    expect(screen.getByTestId("pending")).toBeInTheDocument();
  });

  it("Operator з дозволом → children", () => {
    const token = makeAccessToken({ role: [APP_ROLES.Operator] });
    renderWithRoute(token, [APP_ROLES.Operator]);
    expect(screen.getByTestId("ok")).toBeInTheDocument();
  });

  it("Operator без прав на admin-маршрут → повідомлення", () => {
    const token = makeAccessToken({ role: [APP_ROLES.Operator] });
    renderWithRoute(token, [APP_ROLES.Administrator]);
    expect(screen.getByText(/Немає доступу/)).toBeInTheDocument();
  });

  it("Administrator завжди проходить", () => {
    const token = makeAccessToken({ role: [APP_ROLES.Administrator] });
    renderWithRoute(token, [APP_ROLES.Operator]);
    expect(screen.getByTestId("ok")).toBeInTheDocument();
  });
});
