import { useEffect, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import TRANSLATIONS_EN from '@/shared/locales/en/common';
import TRANSLATIONS_RU from '@/shared/locales/ru/common';
import useLocales from '@/shared/hooks/useLocales';

import styles from './Main.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigationButtonClick = (
    e: SyntheticEvent<HTMLButtonElement>,
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

      <Button value={'/about'} onClick={handleNavigationButtonClick}>
        {i18n('About Tarot')}
      </Button>
    </div>
  );
};
