import { type SpreadParams } from '@/entities/Spread';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SpreadState {
  value: SpreadParams;
}

const initialState: SpreadState = {
  value: {
    cardsCount: 0,
    question: '',
    id: 'single',
    userId: 0,
  },
};

export const spreadSlice = createSlice({
  name: 'spread',
  initialState,
  reducers: {
    setSpread: (state, action: PayloadAction<SpreadParams>) => {
      state.value = action.payload;
    },
  },
});

export const { setSpread } = spreadSlice.actions;

export default spreadSlice.reducer;
