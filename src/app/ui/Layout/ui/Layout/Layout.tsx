import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';

import Header from '../Header/Header';

import { useAuth } from '@/app/auth/auth';

import styles from './Layout.module.css';

export const Layout = () => {
  const { state } = useNavigation();

  const isLoading = state === 'loading';

  const { isLoading: isAuthenticating, user } = useAuth();

  useEffect(() => {
    const telegram = window?.Telegram?.WebApp;

    telegram?.ready();

    if (telegram?.platform === 'ios' || telegram?.platform === 'android') {
      telegram?.SettingsButton?.hide();
      telegram?.expand();
    }
  }, []);

  return (
    <div className={styles.layout}>
      <Header></Header>

      <main className={`${styles.main} custom-scrollbar`}>
        {isLoading || isAuthenticating ? (
          <Spinner size={'l'} />
        ) : (
          <Outlet context={{ user }} />
        )}
      </main>
    </div>
  );
};
