import React, { useEffect } from 'react';

import Reading from '@/widgets/Reading';

import Spinner from '@/shared/ui/Spinner';
import useLocales from '@/shared/hooks/useLocales';

import styles from './Reading.module.css';

export const ReadingPage = () => {
  const { loadTranslations, isLoading } = useLocales();

  useEffect(() => {
    loadTranslations('reading');
  }, []);

  return (
    <div className={styles.page}>{isLoading ? <Spinner /> : <Reading />}</div>
  );
};
