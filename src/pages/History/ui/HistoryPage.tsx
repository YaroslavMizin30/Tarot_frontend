import React, { useEffect } from 'react';
import { Link } from 'react-router';

import { useSpreads } from '@/entities/Spread';
import TarotCard from '@/entities/TarotCard';
import { useUserData } from '@/entities/User';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/history';
import TRANSLATIONS_RU from '@/shared/locales/ru/history';
import Zodiac from '@/shared/ui/Zodiac';
import Button from '@/shared/ui/Button';

import styles from './HistoryPage.module.css';

export const HistoryPage = () => {
  const { spreads } = useSpreads();
  const { i18n, addTranslations } = useLocales();
  const { userData } = useUserData();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{i18n('Spreads history')}</h3>

      <Zodiac sign={userData?.sign} className={styles.zodiac} />

      <div className={`${styles.list} custom-scrollbar`}>
        {spreads &&
          spreads.map((spread) => (
            <div className={styles.spread} key={spread.id}>
              <div className={styles.info}>
                {spread.title ? (
                  <span>{`${i18n('Title')}: ${spread.title}`}</span>
                ) : (
                  <span>{`${i18n('Title')}: ${spread.question}`}</span>
                )}

                <span>{`${i18n('Date')}: ${spread.date}`}</span>

                <Link state={spread} to={`/history/${spread.spreadId ?? 54643543}`}>
                  <Button>{i18n('View')}</Button>
                </Link>
              </div>

              <div className={`${styles.cards} custom-scrollbar`}>
                {spread.cards.map((card) => {
                  return (
                    <TarotCard
                      name={card.name}
                      localizedName={i18n(card.name)}
                      key={card.name}
                      isInverted={card.isInverted}
                      className={styles.card}
                    />
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
