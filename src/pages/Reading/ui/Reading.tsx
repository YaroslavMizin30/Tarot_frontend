import { useLayoutEffect } from 'react';

import Reading from '@/widgets/Reading';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/reading';
import TRANSLATIONS_RU from '@/shared/locales/ru/reading';

export const ReadingPage = () => {
  const { addTranslations, locale } = useLocales();

  useLayoutEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations, locale]);

  return <Reading />;
};
