import { Outlet, useNavigation, useLocation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';
import Error from '@/shared/ui/Error';

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

const THEME_CONFIG = {
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

export const Layout = () => {
  const { state } = useNavigation();
  const { pathname } = useLocation();

  const { addTranslations, i18n, locale } = useLocales();

  const isLoading = state === 'loading';

  const {
    isLoading: isAuthenticating,
    user,
    error: authError,
    retry: retryAuth,
  } = useAuth();

  const { theme } = user ?? {};
  const isAuthShell =
    isAuthenticating || Boolean(authError) || pathname === '/reg' || !user;
  const isRegistrationCompleting = Boolean(user) && pathname === '/reg';
  const isAuthLoadingVisible =
    isAuthenticating ||
    (!user && !authError && pathname !== '/reg') ||
    isRegistrationCompleting;
  const canRenderOutlet =
    !isAuthenticating && (Boolean(user) || pathname === '/reg');

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations, locale]);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      window.Telegram?.WebApp?.setHeaderColor(THEME_CONFIG[theme].header);
      window.Telegram?.WebApp?.setBottomBarColor(THEME_CONFIG[theme].footer);
    } else {
      window.Telegram?.WebApp?.setHeaderColor('#323232');
      window.Telegram?.WebApp?.setBottomBarColor('#323232');
    }
  }, [theme]);

  return (
    <div className={styles.layout}>
      {!isAuthShell && <Header />}

      <main
        className={`${styles.main} ${isAuthShell ? styles.authShell : ''} custom-scrollbar`}
      >
        <div className={styles.background}>
          {!isAuthShell && pathname !== '/' && (
            <>
              <div className={styles.cloud}></div>
              <div className={styles.couldBottom}></div>
            </>
          )}

          {(isAuthShell || getPageAttachment('astrology', pathname)) && (
            <StarsComposition />
          )}
          {getPageAttachment('tarot', pathname) && pathname !== '/' && (
            <TorchComposition />
          )}

        </div>

        {isLoading && !isAuthShell ? (
          <Spinner size={'l'} />
        ) : authError ? (
          <div className={`${styles.container} ${styles.authContainer}`}>
            <div className={styles.authStatus}>
              <Error
                error={i18n(
                  'Authentication failed. Open the app from Telegram and try again',
                )}
                onRetryButtonClick={() => {
                  retryAuth().catch(() => undefined);
                }}
              />
            </div>
          </div>
        ) : canRenderOutlet ? (
          <div
            className={`${styles.container} ${isAuthShell ? styles.authContainer : ''}`}
          >
            <Outlet context={{ user }} />
          </div>
        ) : null}
      </main>

      {!isAuthShell && <Footer />}

      <div
        aria-hidden={!isAuthLoadingVisible}
        className={`${styles.authLoadingLayer} ${
          isAuthLoadingVisible ? styles.authLoadingLayerVisible : ''
        }`}
      >
        <StarsComposition />
        <div aria-busy={isAuthLoadingVisible} className={styles.authStatus}>
          <Spinner size={'l'} />
          <span>
            {i18n(
              isRegistrationCompleting
                ? 'Opening the app'
                : 'Confirming sign-in',
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
