import { Outlet, useNavigation, useLocation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import { useAuth } from '@/app/auth/auth';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/common';
import TRANSLATIONS_RU from '@/shared/locales/ru/common';

import StarsComposition from '@/app/ui/Layout/ui/StarsComposition';
import TorchComposition from '@/app/ui/Layout/ui/TorchComposition/TorchComposition';

import { getPageAttachment } from '../../config/pages';

import styles from './Layout.module.css';
import { useEffect } from 'react';

export const Layout = () => {
  const { state } = useNavigation();
  const { pathname } = useLocation();

  const { addTranslations, locale } = useLocales();

  const isLoading = state === 'loading';

  const { isLoading: isAuthenticating, user } = useAuth();

  const { theme } = user ?? {};

  const themeConfig = {
    standard: {
      header: '#35245c',
      footer: '#f0d6e5',
    },
    gray: {
      header: '#2d3348',
      footer: '#e2e4e9',
    },
    bronze: {
      header: '#552b18',
      footer: '#f0dcc4',
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
        <div className={styles.background}>
          <div className={styles.cloud}></div>
          <div className={styles.couldBottom}></div>

          {getPageAttachment('astrology', pathname) && (
            <StarsComposition isDeep={pathname === '/astrology'} />
          )}
          {getPageAttachment('tarot', pathname) && pathname !== '/' && (
            <TorchComposition />
          )}

        </div>

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
