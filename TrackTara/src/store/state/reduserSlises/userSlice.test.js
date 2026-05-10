import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import userReducer, { authUser, logout } from "./userSlice";

describe("userSlice", () => {
  it("authUser встановлює користувача та isAuthenticated", () => {
    const store = configureStore({ reducer: { user: userReducer } });
    store.dispatch(authUser({ id: 1, email: "a@test.com", role: ["Operator"] }));
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(store.getState().user.currentUser.email).toBe("a@test.com");
  });

  it("logout скидає стан", () => {
    const store = configureStore({ reducer: { user: userReducer } });
    store.dispatch(authUser({ id: 1 }));
    store.dispatch(logout());
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().user.currentUser).toBeNull();
  });
});
