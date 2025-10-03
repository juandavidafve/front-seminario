import { createSlice } from "@reduxjs/toolkit";

import type { User } from "@/schemas/User";

export interface AuthState {
  user: User | undefined | null;
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: undefined, // undefined when is loading, null when there is no session
  } as AuthState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    update: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, update } = authSlice.actions;

export default authSlice.reducer;
