import { useEffect } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import Billing from '@/widgets/Billing';
import TRANSLATIONS_EN from '@/shared/locales/en/billing';
import TRANSLATIONS_RU from '@/shared/locales/ru/billing';

import styles from './BillingPage.module.css';

export const BillingPage = () => {
  const { addTranslations, locale } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  return (
    <div className={styles.page}>
      <Billing />
    </div>
  );
};
