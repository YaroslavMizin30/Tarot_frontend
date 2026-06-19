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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
