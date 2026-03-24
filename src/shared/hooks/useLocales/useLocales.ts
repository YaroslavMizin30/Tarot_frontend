import { useAppDispatch, useAppSelector, type RootState } from '@/app/store';

import {
  changeLocale,
  addPreloadedLocation,
  preloadTranslations,
} from '@/app/store';

import type { Locale, Location, UseLocalesResult } from './types';
import { useState } from 'react';

export const useLocales = (): UseLocalesResult => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const translations = useAppSelector(
    (state: RootState) => state.locales.value.translations,
  );

  const locale = useAppSelector(
    (state: RootState) => state.locales.value.locale,
  );

  const locations = useAppSelector(
    (state: RootState) => state.locales.value.locations,
  );

  const loadTranslations = async (location: Location) => {
    if (locations[location]) {
      return;
    }

    try {
      setIsLoading(true);

      const { default: translations } = await import(
        `/src/shared/locales/${locale}/${location}.ts`
      );

      dispatch(preloadTranslations(translations));

      dispatch(addPreloadedLocation(location));
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (id: Locale) => {
    dispatch(changeLocale(id));
  };

  const i18n = (id: string) => {
    return translations[id] || id;
  };

  return {
    isLoading,
    translations,
    locale,
    changeLanguage,
    loadTranslations,
    i18n,
  };
};
