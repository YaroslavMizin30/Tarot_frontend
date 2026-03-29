import { configureStore } from '@reduxjs/toolkit';

import spreadReducer from './slices/spread';
import localeReducer from './slices/locales';
import userReducer from './slices/user';

export const store = configureStore({
  reducer: {
    spread: spreadReducer,
    locales: localeReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
