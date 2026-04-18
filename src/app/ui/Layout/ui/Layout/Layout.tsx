import React from 'react';

import { Outlet, useNavigation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';

import { useUserData } from '@/entities/User';

import Header from '../Header/Header';

import styles from './Layout.module.css';

export const Layout = () => {
  const { state } = useNavigation();

  const isLoading = state === 'loading';
  const { isLoading: isUserDataLoading } = useUserData();

  return (
    <div className={styles.layout}>
      <Header></Header>

      <main className={styles.main}>
        {isLoading || isUserDataLoading ? <Spinner size={'l'} /> : <Outlet />}
      </main>
    </div>
  );
};
