import type { User } from '@/entities/User';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getUser } from '@/entities/User';

export interface UserState {
  value: User | null;
  loading: 'idle' | 'loading' | 'failed';
  error: null | string;
}

const initialState: UserState = {
  value: null,
  loading: 'idle',
  error: null,
};

export const setUser = createAsyncThunk(
  'user/fetchUser',
  async (id: string | number) => {
    const user = await getUser(id);

    return user;
  },
  {
    condition: (_, { getState }) => {
      //@ts-ignore
      const { user } = getState();

      if (user.loading === 'loading') {
        return false;
      }
    },
  },
);

export const userSlice = createSlice({
  name: 'spread',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setUser.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.value = action.payload;
      })
      .addCase(setUser.rejected, (state) => {
        state.loading = 'failed';
        state.error = 'Failed to load user data';
      });
  },
});

export default userSlice.reducer;
