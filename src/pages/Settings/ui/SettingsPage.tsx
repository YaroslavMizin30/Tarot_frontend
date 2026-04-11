import React, { useEffect } from 'react';

import { useUserData } from '@/entities/User';

import { HIDDEN_FIELDS } from '../config/fields';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/settings';
import TRANSLATIONS_RU from '@/shared/locales/ru/settings';
import Button from '@/shared/ui/Button';

import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const { userData } = useUserData();

  const { i18n, addTranslations } = useLocales();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, []);

  if (!userData) {
    return null;
  }

  const data = Object.keys(userData).map((key) => {
    if (HIDDEN_FIELDS.includes(key) || userData[key] === null) {
      return null;
    }

    return (
      <div className={styles.option}>
        <p>{i18n(key)}</p>

        <Button>{userData[key as keyof typeof userData]}</Button>
      </div>
    );
  });

  return <div className={styles.container}>{data}</div>;
};
