import type { User } from '@/entities/User';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getUser } from '@/entities/User';

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: null | string;
}

const initialState: UserState = {
  user: null,
  isLoading: true,
  error: null,
};

export const setUser = createAsyncThunk(
  'user/fetchUser',
  async (id: string | number) => {
    const user = await getUser(id);

    return user;
  },
);

export const userSlice = createSlice({
  name: 'spread',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(setUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Failed to load user data';
      });
  },
});

export default userSlice.reducer;
