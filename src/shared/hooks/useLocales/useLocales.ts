import { useCallback } from 'react';

import {
  useAppDispatch,
  useAppSelector,
  type RootState,
  changeLocale,
  preloadTranslations,
} from '@/app/store';

import type { Locale, UseLocalesResult } from './types';

export const useLocales = (): UseLocalesResult => {
  const dispatch = useAppDispatch();

  const translations = useAppSelector(
    (state: RootState) => state.locales.value.translations,
  );

  const locale = useAppSelector(
    (state: RootState) => state.locales.value.locale,
  );

  const addTranslations = useCallback(
    (translations: Record<`${Locale}`, Record<string, string>>) => {
      dispatch(preloadTranslations(translations[locale]));
    },
    [dispatch, locale],
  );

  const changeLanguage = (id: Locale) => {
    if (id === locale) {
      return;
    }

    dispatch(changeLocale(id));
  };

  const i18n = (
    id: string,
    params?: Record<string, string | number>,
  ) => {
    const translation = translations[id] || id;

    if (!params) return translation;

    return Object.entries(params).reduce(
      (result, [key, value]) =>
        result.replaceAll(`{${key}}`, String(value)),
      translation,
    );
  };

  return {
    translations,
    locale,
    changeLanguage,
    addTranslations,
    i18n,
  };
};
