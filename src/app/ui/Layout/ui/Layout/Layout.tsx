import { Outlet, useNavigation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';
import Zodiac from '@/shared/ui/Zodiac';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

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

        <Zodiac sign={user?.sign} className={styles.zodiac} />

        {isLoading || isAuthenticating ? (
          <Spinner size={'l'} />
        ) : (
          <div className={styles.container}>
            <Outlet context={{ user }} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
