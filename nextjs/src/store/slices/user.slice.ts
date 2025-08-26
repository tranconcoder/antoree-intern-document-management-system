import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { fetchLogin, fetchRegister, logoutUser } from "../thunks/user.thunk";

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
     * Clear error message
     */
    clearError(state) {
      state.errorMessage = "";
    },
  },

  extraReducers(builder) {
    builder
      // Handle rehydration from redux-persist
      .addCase(REHYDRATE, (state, action: any) => {
        if (action.payload?.user) {
          // Check if tokens are still valid (you might want to add expiration check here)
          const persistedUser = action.payload.user;
          if (persistedUser.tokens && persistedUser.user) {
            state.user = persistedUser.user;
            state.tokens = persistedUser.tokens;
            state.isLoggedIn = true;
            state.errorMessage = "";
          }
        }
      })
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
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.isLoggedIn = false;
        state.errorMessage = "";
      });
  },
});

export const { setCredentials, clearError } = userSlice.actions;
export default userSlice.reducer;
