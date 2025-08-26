import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchLogin, fetchRegister } from "../thunks/user.thunk";

// Define a type for the slice state
interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface UserState {
  user: User | null;
  tokens: Tokens | null;

  isLoggedIn: boolean;
  isLoading: boolean;

  errorMessage: string;
}

const initialState: UserState = {
  user: null,
  tokens: null,

  isLoggedIn: false,
  isLoading: false,

  errorMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Set user credentials after login/register
     */
    setCredentials(
      state,
      action: PayloadAction<{ user: User; tokens: Tokens }>
    ) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isLoggedIn = true;
      state.errorMessage = "";
    },

    /**
     * Clear user credentials on logout
     */
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.isLoggedIn = false;
      state.errorMessage = "";
    },

    /**
     * Clear error message
     */
    clearError(state) {
      state.errorMessage = "";
    },
  },

  extraReducers(builder) {
    builder
      // Login cases
      .addCase(fetchLogin.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;

        state.isLoggedIn = true;
        state.isLoading = false;

        state.errorMessage = "";
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.user = null;
        state.tokens = null;

        state.isLoggedIn = false;
        state.isLoading = false;

        state.errorMessage = action.error.message || "Đăng nhập thất bại";
      })

      // Register cases
      .addCase(fetchRegister.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;

        state.isLoggedIn = true;
        state.isLoading = false;

        state.errorMessage = "";
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.user = null;
        state.tokens = null;

        state.isLoggedIn = false;
        state.isLoading = false;

        state.errorMessage = action.error.message || "Đăng ký thất bại";
      });
  },
});

export const { setCredentials, logout, clearError } = userSlice.actions;
export default userSlice.reducer;
