import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user:
    | {
        name: string;
        email: string;
      }
    | undefined
    | null;
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
    logout: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
