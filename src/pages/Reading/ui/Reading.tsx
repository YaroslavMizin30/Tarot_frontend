import React, { useEffect } from 'react';

import Reading from '@/widgets/Reading';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/reading';
import TRANSLATIONS_RU from '@/shared/locales/ru/reading';

export const ReadingPage = () => {
  const { addTranslations, locale } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return <Reading />;
};
