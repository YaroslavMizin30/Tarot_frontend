import { useEffect, useState } from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';
import Error from '@/shared/ui/Error';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import { useAuth } from '@/app/auth/auth';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/common';
import TRANSLATIONS_RU from '@/shared/locales/ru/common';
import DeferredComposition from '@/shared/ui/DeferredComposition';

import { getPageAttachment } from '../../config/pages';

import styles from './Layout.module.css';

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

const loadStarsComposition = () => import('../StarsComposition');
const loadTorchComposition = () =>
  import('../TorchComposition/TorchComposition');
const AUTH_BACKGROUND_EXIT_DELAY = 460;
const TAROT_BACKGROUND_FADE_IN_DURATION = 3600;
const VOLUMETRIC_BACKGROUND_FADE_CURVE =
  'cubic-bezier(0.37, 0, 0.63, 1)';

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
  const shouldShowAuthLoading =
    isAuthenticating ||
    (!user && !authError && pathname !== '/reg') ||
    isRegistrationCompleting;
  const [isAuthLoadingVisible, setIsAuthLoadingVisible] = useState(true);
  const [isAuthBackgroundMounted, setIsAuthBackgroundMounted] =
    useState(true);
  const canRenderOutlet =
    !isAuthenticating && (Boolean(user) || pathname === '/reg');
  const hasTarotBackground =
    !isAuthShell &&
    pathname !== '/' &&
    getPageAttachment('tarot', pathname);
  const hasAstrologyBackground =
    !isAuthShell && getPageAttachment('astrology', pathname);
  const shouldMountAuthLayerContent =
    isAuthLoadingVisible || isAuthBackgroundMounted;

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;

    if (shouldShowAuthLoading) {
      firstFrame = window.requestAnimationFrame(() => {
        setIsAuthLoadingVisible(true);
      });
    } else {
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setIsAuthLoadingVisible(false);
        });
      });
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [shouldShowAuthLoading]);

  useEffect(() => {
    let animationFrame = 0;
    let unmountTimeout = 0;

    if (isAuthLoadingVisible) {
      animationFrame = window.requestAnimationFrame(() => {
        setIsAuthBackgroundMounted(true);
      });
    } else {
      unmountTimeout = window.setTimeout(() => {
        setIsAuthBackgroundMounted(false);
      }, AUTH_BACKGROUND_EXIT_DELAY);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(unmountTimeout);
    };
  }, [isAuthLoadingVisible]);

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
        aria-busy={isLoading && !isAuthShell}
        className={`${styles.main} ${isAuthShell ? styles.authShell : ''} custom-scrollbar`}
      >
        <div
          className={`${styles.background} ${
            hasTarotBackground ? styles.tarotBackgroundBase : ''
          } ${
            hasAstrologyBackground ? styles.astrologyBackgroundBase : ''
          }`}
        >
          {!isAuthShell &&
            pathname !== '/' &&
            !hasTarotBackground &&
            !hasAstrologyBackground && (
            <>
              <div className={styles.cloud}></div>
              <div className={styles.couldBottom}></div>
            </>
          )}

          {isAuthShell && !isAuthLoadingVisible && (
            <DeferredComposition
              delay={0}
              loader={loadStarsComposition}
            />
          )}
          {hasAstrologyBackground && (
            <DeferredComposition
              isExiting={isLoading}
              loader={loadStarsComposition}
            />
          )}
          {hasTarotBackground && (
            <DeferredComposition
              delay={0}
              fadeInDuration={TAROT_BACKGROUND_FADE_IN_DURATION}
              fadeInTimingFunction={VOLUMETRIC_BACKGROUND_FADE_CURVE}
              isExiting={isLoading}
              loader={loadTorchComposition}
            />
          )}

        </div>

        {isLoading && !isAuthShell && (
          <div aria-hidden={'true'} className={styles.routeProgress} />
        )}

        {authError ? (
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
            className={`${styles.container} ${
              isAuthShell ? styles.authContainer : styles.routeContent
            } ${
              isLoading && !isAuthShell ? styles.routeContentLeaving : ''
            }`}
          >
            {isAuthShell ? (
              <Outlet context={{ user }} />
            ) : (
              <div className={styles.routePage} key={pathname}>
                <Outlet context={{ user }} />
              </div>
            )}
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
        {shouldMountAuthLayerContent && (
          <>
            <DeferredComposition
              delay={0}
              loader={loadStarsComposition}
            />
            <div
              aria-busy={isAuthLoadingVisible}
              className={styles.authStatus}
            >
              <Spinner size={'l'} />
              <span>
                {i18n(
                  isRegistrationCompleting
                    ? 'Opening the app'
                    : 'Confirming sign-in',
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
