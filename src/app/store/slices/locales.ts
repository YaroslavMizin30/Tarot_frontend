import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Locale, Location } from '@/shared/hooks/useLocales';

export interface SpreadState {
  value: {
    locale: Locale;
    translations: Record<string, string>;
    locations: Record<Location, boolean>;
  };
}

const initialState: SpreadState = {
  value: {
    locale: 'ru',
    translations: {},
    locations: {
      common: false,
      reading: false,
      settings: false,
      daily: false,
      history: false,
    },
  },
};

export const localeSlice = createSlice({
  name: 'spread',
  initialState,
  reducers: {
    changeLocale: (state, action: PayloadAction<'ru' | 'en'>) => {
      state.value.locale = action.payload;

      state.value.locations = initialState.value.locations;
    },
    preloadTranslations: (
      state,
      action: PayloadAction<Record<string, string>>,
    ) => {
      state.value.translations = {
        ...state.value.translations,
        ...action.payload,
      };
    },
    addPreloadedLocation: (state, action: PayloadAction<Location>) => {
      state.value.locations[action.payload] = true;
    },
  },
});

export const { changeLocale, preloadTranslations, addPreloadedLocation } =
  localeSlice.actions;

export default localeSlice.reducer;
