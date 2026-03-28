import React from 'react';

import { Outlet, useNavigation } from 'react-router';

import Spinner from '@/shared/ui/Spinner';

import Header from '../Header/Header';

import styles from './Layout.module.css';

export const Layout = () => {
  const { state } = useNavigation();

  const isLoading = state === 'loading';

  return (
    <div className={styles.layout}>
      <Header></Header>

      <main className={styles.main}>
        {isLoading ? <Spinner size={'l'} /> : <Outlet />}
      </main>
    </div>
  );
};
