import { Outlet, useNavigation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';

import Header from '../Header/Header';

import { useAuth } from '@/app/auth/auth';

import styles from './Layout.module.css';
import { useEffect } from 'react';

export const Layout = () => {
  const { state } = useNavigation();

  const isLoading = state === 'loading';

  const { isLoading: isAuthenticating, user } = useAuth();

  const { theme = 'standard' } = user ?? {};

  const themeConfig = {
    standard: {
      header: '#ffdb88',
      footer: '#ff91f0',
    },
    gray: {
      header: '#4e378b',
      footer: '#dadada',
    },
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.Telegram?.WebApp?.setHeaderColor(themeConfig[theme].header);
    window.Telegram?.WebApp?.setBottomBarColor(themeConfig[theme].footer);
  }, [theme]);

  return (
    <div className={styles.layout}>
      <Header></Header>

      <main className={`${styles.main} custom-scrollbar`}>
        <div className={styles.cloud}></div>

        <div className={styles.couldBottom}></div>

        {isLoading || isAuthenticating ? (
          <Spinner size={'l'} />
        ) : (
          <div className={styles.container}>
            <Outlet context={{ user }} />
          </div>
        )}
      </main>
    </div>
  );
};
