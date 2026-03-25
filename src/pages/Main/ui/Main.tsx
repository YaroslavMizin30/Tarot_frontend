import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';

import Layout from '@/pages/Layout';

import styles from './Main.module.css';
import useLocales from '@/shared/hooks/useLocales';

export const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigationButtonClick = (
    e: React.SyntheticEvent<HTMLButtonElement>,
  ) => {
    navigate(e.currentTarget.value);
  };

  const { i18n, loadTranslations, locale } = useLocales();

  useEffect(() => {
    loadTranslations('common');
  }, [locale]);

  return (
    <Layout>
      <div className={styles.page}>
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
      </div>
    </Layout>
  );
};
