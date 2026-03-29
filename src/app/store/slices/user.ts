import type { User } from '@/entities/User';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SpreadState {
  value: User | null;
}

const initialState: SpreadState = {
  value: null,
};

export const userSlice = createSlice({
  name: 'spread',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
