import React from 'react';

import Layout from '@/pages/Layout';
import TarotSpread from '@/features/TarotSpread';
import useLocales from '@/shared/hooks/useLocales';

import styles from './DailyCard.module.css';

export const DailyCard = () => {
  const { i18n } = useLocales();

  return (
    <Layout>
      <div className={styles.page}>
        <TarotSpread
          spread={{
            id: 'single',
            cardsCount: 1,
            question: i18n('Card of the day'),
          }}
        />
      </div>
    </Layout>
  );
};
