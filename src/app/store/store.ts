import { configureStore } from '@reduxjs/toolkit';

import spreadReducer from './slices/spread';
import localeReducer from './slices/locales';

export const store = configureStore({
  reducer: {
    spread: spreadReducer,
    locales: localeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
