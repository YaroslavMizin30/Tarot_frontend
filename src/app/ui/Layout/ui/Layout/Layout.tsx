import { Outlet, useNavigation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';

import { useUserData } from '@/entities/User';

import Header from '../Header/Header';

import { useAuth } from '@/app/auth/auth';

import styles from './Layout.module.css';

export const Layout = () => {
  const { state } = useNavigation();

  const isLoading = state === 'loading';
  const { isLoading: isUserDataLoading } = useUserData();
  const { isLoading: isAuthenticating } = useAuth();

  return (
    <div className={styles.layout}>
      <Header></Header>

      <main className={`${styles.main} custom-scrollbar`}>
        {isLoading || isUserDataLoading || isAuthenticating ? (
          <Spinner size={'l'} />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};
