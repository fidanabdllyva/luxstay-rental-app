import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { registerUser, loginUser } from './authAPI';
import type { User } from '@/types/users';

const storedUser = localStorage.getItem('user');
const parsedUser = storedUser ? (JSON.parse(storedUser) as User) : null;

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: parsedUser,
  loading: false,
  error: null,
  isLoggedIn: Boolean(parsedUser),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('user');
    },
    updateUserBalance(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.balance = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Registration failed';
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        if (
          action.payload &&
          typeof action.payload === 'object' &&
          'error' in action.payload
        ) {
          state.error = (action.payload as { error: string }).error;
        } else if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = 'Login failed';
        }
      });
  },
});

export const { logout, updateUserBalance, setUser } = authSlice.actions;
export default authSlice.reducer;
