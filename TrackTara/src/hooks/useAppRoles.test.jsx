import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import useAppRoles from "./useAppRoles";
import userReducer from "../store/state/reduserSlises/userSlice";
import { makeAccessToken } from "../test/jwtTestUtils";

function wrapper(store) {
  return function W({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe("useAppRoles", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("пріоритет ролей з JWT у localStorage", () => {
    localStorage.setItem("accessToken", makeAccessToken({ role: ["SalesManager"] }));
    const store = configureStore({
      reducer: { user: userReducer },
      preloadedState: { user: { currentUser: { role: ["Operator"] }, isAuthenticated: true } },
    });
    const { result } = renderHook(() => useAppRoles(), { wrapper: wrapper(store) });
    expect(result.current).toContain("SalesManager");
  });

  it("без токена — ролі з Redux currentUser", () => {
    const store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: {
          currentUser: { role: ["Administrator"] },
          isAuthenticated: true,
        },
      },
    });
    const { result } = renderHook(() => useAppRoles(), { wrapper: wrapper(store) });
    expect(result.current).toContain("Administrator");
  });
});
