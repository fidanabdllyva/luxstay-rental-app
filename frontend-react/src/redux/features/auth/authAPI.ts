import instance from '@/api/axios-instance';
import type { User } from '@/types/users';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk<
  User,
  { username: string; email: string; password: string },
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await instance.post('/api/auth/register', userData);
      return response.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Registration failed');
    }
  }
);


export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: { error: string; banDate?: string } }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await instance.post('/api/auth/login', credentials);
      return response.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { error: 'Login failed' });
    }
  }
);

