import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import ArrowButton from '@/shared/ui/ArrowButton';
import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/roulette';
import TRANSLATIONS_RU from '@/shared/locales/ru/roulette';

import { Rules } from './Rules/Rules';
import { Roulette } from './Roulette/Roulette';

import styles from './RoulettePage.module.css';

export const RoulettePage = () => {
  const { locale, addTranslations, i18n } = useLocales();
  const navigate = useNavigate();

  const [subPage, setSubPage] = useState<'main' | 'rules'>('main');

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const renderContent = () => {
    switch (subPage) {
      case 'main':
        return (
          <>
            <ArrowButton
              className={styles.homeArrow}
              onClick={() => navigate('/')}
              aria-label={i18n('Home')}
            />
            <Roulette onRulesButtonClick={() => setSubPage('rules')} />
          </>
        );
      case 'rules':
        return (
          <>
            <Rules />

            <ArrowButton onClick={() => setSubPage('main')} />
          </>
        );
    }
  };

  return <div className={styles.container}>{renderContent()}</div>;
};
