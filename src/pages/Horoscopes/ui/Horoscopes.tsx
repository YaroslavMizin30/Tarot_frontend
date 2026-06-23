import { useState } from 'react';

import Feed from '@/features/Feed';
import type { Message } from '@/features/Feed/ui/Feed.props';

import StarsComposition from '@/pages/ui/StarsComposition';

import { useHoroscopes } from '@/entities/Horoscope';

import useLocales from '@/shared/hooks/useLocales';
import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';

import styles from './Horoscopes.module.css';

const TYPES: { name: string; value: 'daily' | 'weekly' | 'monthly' }[] = [
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'monthly' },
];

export const Horoscopes = () => {
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { i18n } = useLocales();
  const { horoscopes, isLoading } = useHoroscopes();

  const filteredHoroscopes = horoscopes?.filter(
    (h) => h.type === selectedType,
  );

  const messages: Message[] | undefined = filteredHoroscopes?.map((h) => ({
    id: h.id,
    text: h.content,
    date: new Date(h.date),
    sender: 'Tarotopia',
    isUser: false,
  }));

  return (
    <div className={styles.container}>
      <StarsComposition />

      <div className={styles.content}>
        <div className={styles['content-header']}>
          {TYPES.map((type) => {
            const isActive = type.value === selectedType;

            return (
              <Button
                key={type.value}
                className={`${styles.button} ${isActive ? styles.active : ''}`}
                onClick={() => setSelectedType(type.value)}
              >
                {type.name}
              </Button>
            );
          })}
        </div>

        <Feed
          messages={messages ?? []}
          maxHeight={80}
          maxHeightMeasure={'%'}
          className={styles.feed}
          isLoading={isLoading}
        />

        <Button>{i18n('Compose')}</Button>
      </div>

      <ArrowButton />
    </div>
  );
};
