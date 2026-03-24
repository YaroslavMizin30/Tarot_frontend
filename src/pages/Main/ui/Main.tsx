import React from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';

import Layout from '@/pages/Layout/Layout';

import styles from './Main.module.css';

export const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigationButtonClick = (
    e: React.SyntheticEvent<HTMLButtonElement>,
  ) => {
    navigate(e.currentTarget.value);
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.container}>
          <Button value={'/reading'} onClick={handleNavigationButtonClick}>
            Reading
          </Button>

          <Button value={'/history'} onClick={handleNavigationButtonClick}>
            History
          </Button>
        </div>
      </div>
    </Layout>
  );
};
