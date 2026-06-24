import { useEffect, useMemo, useState, type FormEvent } from 'react';

import Feed from '@/features/Feed';
import type { Message } from '@/features/Feed/ui/Feed.props';

import StarsComposition from '@/pages/ui/StarsComposition';

import { useHoroscopes } from '@/entities/Horoscope';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/horoscopes';
import TRANSLATIONS_RU from '@/shared/locales/ru/horoscopes';
import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';

import styles from './Horoscopes.module.css';

const TYPES: { name: string; value: 'daily' | 'weekly' | 'monthly' }[] = [
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'monthly' },
];

export const Horoscopes = () => {
  const [selectedType, setSelectedType] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');

  const { i18n, addTranslations, locale } = useLocales();
  const {
    horoscopes,
    isLoading,
    isAdding,
    addHoroscope,
    setUserMessage,
    message,
  } = useHoroscopes();

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const filteredHoroscopes = useMemo(() => {
    return horoscopes?.filter((h) => h.type === selectedType);
  }, [selectedType, horoscopes]);

  const messages: Message[] | undefined = filteredHoroscopes?.map((h) => ({
    id: h.id,
    text: h.content,
    date: new Date(h.date),
    sender: h.sender ?? 'Tarotopia',
    isUser: h.isUserMessage ?? false,
    avatar: !h.isUserMessage
      ? '/assets/images/horoscope/tarotopia-avatar.jpeg'
      : undefined,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    addHoroscope(selectedType);
  };

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
                {i18n(type.name)}
              </Button>
            );
          })}
        </div>

        <Feed
          messages={messages ?? []}
          maxHeight={80}
          maxHeightMeasure={'%'}
          className={styles.feed}
          isLoading={isLoading || isAdding}
        />

        <form className={styles.composeForm} onSubmit={handleSubmit}>
          <textarea
            className={styles.composeInput}
            value={message}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder={i18n('Additional thoughts (optional)...')}
          />
          <div className={styles.composeActions}>
            <Button type={'submit'} disabled={isAdding} isLoading={isAdding}>
              {isAdding ? i18n('Generating...') : i18n('Compose')}
            </Button>
          </div>
        </form>
      </div>

      <ArrowButton />
    </div>
  );
};
