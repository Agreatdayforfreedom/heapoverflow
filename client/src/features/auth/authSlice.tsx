import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../interfaces/interfaces";
import { authThunk, loginThunk, signupThunk } from "./authApi";

// Define a type for the slice state
interface AuthState {
  user: User | undefined;
  token: string;
  loading: boolean;
  error: string | undefined;
}

const token: string = localStorage.getItem("token") as string | "";

const initialState: AuthState = {
  user: undefined,
  token,
  loading: true,
  error: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = undefined;
      state.loading = false;
      state.error = undefined;
    },
    noAuthState: (state) => {
      state.loading = false;
      state.error = undefined;
    },
    showError: (state, action) => {
      state.error = action.payload;
    },
    hideError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state, action) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
    builder
      .addCase(signupThunk.pending, (state, action) => {
        state.user = undefined;
        state.loading = true;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
    builder
      .addCase(authThunk.pending, (state, action) => {
        state.loading = true;
        state.user = undefined;
      })
      .addCase(authThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(authThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { logout, hideError, showError, noAuthState } = authSlice.actions;

export default authSlice.reducer;
