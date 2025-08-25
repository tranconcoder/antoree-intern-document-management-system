import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface UserState {
  user: User | null;
  tokens: Tokens | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  tokens: null,
  isLoggedIn: false,
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
    },
    /**
     * Clear user credentials on logout
     */
    logout(state) {
      state.user = null;
      state.tokens = null;
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;
