import React, { useEffect } from 'react';

import TarotSpread from '@/features/TarotSpread';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/daily';
import TRANSLATIONS_RU from '@/shared/locales/ru/daily';

export const DailyCard = () => {
  const { i18n, addTranslations, locale } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
    <TarotSpread
      spread={{
        id: 'single',
        cardsCount: 1,
        question: i18n('Card of the day'),
      }}
    />
  );
};
