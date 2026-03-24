import React, { type FC } from 'react';

import Header from '../Header/Header';

import type { LayoutProps } from './Layout.props';

import styles from './Layout.module.css';

const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <div className={styles.layout}>
      <Header></Header>

      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
