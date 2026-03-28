import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import TRANSLATIONS_EN from '@/shared/locales/en/common';
import TRANSLATIONS_RU from '@/shared/locales/ru/common';

import styles from './Main.module.css';
import useLocales from '@/shared/hooks/useLocales';

export const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigationButtonClick = (
    e: React.SyntheticEvent<HTMLButtonElement>,
  ) => {
    navigate(e.currentTarget.value);
  };

  const { i18n, addTranslations, locale } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
    <div className={styles.container}>
      <Button value={'/daily'} onClick={handleNavigationButtonClick}>
        {i18n('Card of the day')}
      </Button>

      <Button value={'/reading'} onClick={handleNavigationButtonClick}>
        {i18n('Make spread')}
      </Button>

      <Button value={'/history'} onClick={handleNavigationButtonClick}>
        {i18n('Spreads history')}
      </Button>
    </div>
  );
};
