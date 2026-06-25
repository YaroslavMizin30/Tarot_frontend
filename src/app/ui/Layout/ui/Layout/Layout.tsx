import { Outlet, useNavigation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import { useAuth } from '@/app/auth/auth';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/common';
import TRANSLATIONS_RU from '@/shared/locales/ru/common';

import styles from './Layout.module.css';
import { useEffect } from 'react';

export const Layout = () => {
  const { state } = useNavigation();

  const { addTranslations, locale } = useLocales();

  const isLoading = state === 'loading';

  const { isLoading: isAuthenticating, user } = useAuth();

  const { theme = 'standard' } = user ?? {};

  const themeConfig = {
    standard: {
      header: '#001d73',
      footer: '#ff91f0',
    },
    gray: {
      header: '#282e51',
      footer: '#dadada',
    },
    bronze: {
      header: '#6b2700',
      footer: '#db9d9d',
    },
  };

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      window.Telegram?.WebApp?.setHeaderColor(themeConfig[theme].header);
      window.Telegram?.WebApp?.setBottomBarColor(themeConfig[theme].footer);
    } else {
      window.Telegram?.WebApp?.setHeaderColor('#323232');
      window.Telegram?.WebApp?.setBottomBarColor('#323232');
    }
  }, [theme]);

  return (
    <div className={styles.layout}>
      <Header isLoading={isAuthenticating}></Header>

      <main
        className={`${styles.main} ${isAuthenticating ? styles.loading : ''} custom-scrollbar`}
      >
        <div className={styles.cloud}></div>

        <div className={styles.couldBottom}></div>

        <Zodiac sign={user?.sign} className={styles.zodiac} />

        {isLoading || isAuthenticating ? (
          <Spinner size={'l'} />
        ) : (
          <div className={styles.container}>
            <Outlet context={{ user }} />
          </div>
        )}
      </main>

      <Footer isLoading={isAuthenticating} />
    </div>
  );
};
