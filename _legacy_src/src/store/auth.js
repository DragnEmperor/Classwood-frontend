import { createSlice } from "@reduxjs/toolkit";

const AUTH_KEYS = ["token", "UserType", "Payed", "session"];

const readStorage = () => ({
  token: localStorage.getItem("token") || "",
  userType: localStorage.getItem("UserType") || "",
  isPaid: localStorage.getItem("Payed") === "true",
  sessionId: localStorage.getItem("session") || "",
});

const authSlice = createSlice({
  name: "auth",
  initialState: readStorage(),
  reducers: {
    setAuth: (state, action) => {
      const { token, userType, isPaid, sessionId } = action.payload;
      if (token !== undefined) {
        state.token = token;
        localStorage.setItem("token", token);
      }
      if (userType !== undefined) {
        state.userType = userType;
        localStorage.setItem("UserType", userType);
      }
      if (isPaid !== undefined) {
        state.isPaid = isPaid;
        localStorage.setItem("Payed", isPaid ? "true" : "false");
      }
      if (sessionId !== undefined) {
        state.sessionId = sessionId;
        localStorage.setItem("session", sessionId);
      }
    },
    clearAuth: (state) => {
      state.token = "";
      state.userType = "";
      state.isPaid = false;
      state.sessionId = "";
      AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => !!state.auth.token;
