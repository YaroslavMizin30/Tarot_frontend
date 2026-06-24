import { useEffect, useMemo, useState, type FormEvent } from 'react';

import Feed from '@/features/Feed';
import type { Message } from '@/features/Feed/ui/Feed.props';

import StarsComposition from '@/pages/ui/StarsComposition';

import { useHoroscopes } from '@/entities/Horoscope';
import { useUser } from '@/entities/User';

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

  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [systemMessage, setSystemMessage] = useState<Message | null>(null);
  const [scrollOverrideId, setScrollOverrideId] = useState<string | null>(null);

  const { i18n, addTranslations, locale } = useLocales();
  const { user } = useUser() ?? {};
  const {
    horoscopes,
    isLoading,
    isAdding,
    addHoroscope,
    setUserMessage,
    message,
    findExistingHoroscopeInPeriod,
  } = useHoroscopes({
    onSuccess: () => {
      // Clear optimistic messages after data is refetched
      setPendingMessages([]);
    },
  });

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const filteredHoroscopes = useMemo(() => {
    return horoscopes?.filter((h) => h.type === selectedType);
  }, [selectedType, horoscopes]);

  /** Does a horoscope of the selected type already exist for the current period? */
  const existingHoroscopeForPeriod = useMemo(
    () => findExistingHoroscopeInPeriod(selectedType),
    [findExistingHoroscopeInPeriod, selectedType],
  );

  // Combine database horoscopes with pending (optimistic) messages
  // and any system notification message
  const messages: Message[] = useMemo(() => {
    const horoscopeMessages: Message[] = (filteredHoroscopes ?? []).map(
      (h) => ({
        id: h.id,
        text: h.content,
        date: new Date(h.date),
        sender: h.sender ?? 'Tarotopia',
        isUser: h.isUserMessage ?? false,
        avatar: !h.isUserMessage
          ? '/assets/images/horoscope/tarotopia-avatar.jpeg'
          : undefined,
        type: h.type,
      }),
    );

    const result = [...horoscopeMessages, ...pendingMessages];
    if (systemMessage) {
      result.push(systemMessage);
    }
    return result;
  }, [filteredHoroscopes, pendingMessages, systemMessage]);

  // Context-aware loading message
  const loadingMessage = useMemo(() => {
    if (isAdding) {
      return i18n(
        selectedType === 'daily'
          ? 'Generating daily horoscope...'
          : selectedType === 'weekly'
            ? 'Generating weekly horoscope...'
            : 'Generating monthly horoscope...',
      );
    }
    return i18n('Loading...');
  }, [selectedType, isAdding, i18n]);

  // Compute scroll target:
  // - If an override is set (user tried to create a duplicate), use that
  // - Otherwise, scroll to the latest horoscope of the selected type
  const scrollTarget = useMemo(() => {
    if (scrollOverrideId) {
      return scrollOverrideId;
    }

    if (!filteredHoroscopes || filteredHoroscopes.length === 0) {
      return null;
    }

    return filteredHoroscopes[filteredHoroscopes.length - 1].id;
  }, [filteredHoroscopes, scrollOverrideId]);

  const handleTypeChange = (type: 'daily' | 'weekly' | 'monthly') => {
    setSelectedType(type);
    // Clear notifications and scroll override when switching type
    setSystemMessage(null);
    setScrollOverrideId(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // If a horoscope already exists for this period, prevent optimistic update,
    // scroll to the existing horoscope, and show a system notification
    if (existingHoroscopeForPeriod) {
      setScrollOverrideId(existingHoroscopeForPeriod.id);

      setSystemMessage({
        id: `system-${selectedType}-${Date.now()}`,
        text:
          selectedType === 'daily'
            ? i18n('You already have a daily horoscope for today')
            : selectedType === 'weekly'
              ? i18n('You already have a weekly horoscope for this week')
              : i18n('You already have a monthly horoscope for this month'),
        date: new Date(),
        sender: 'Tarotopia',
        isUser: false,
        type: selectedType,
      });

      return;
    }

    // Immediately show the user's message in the feed (optimistic update)
    if (message.trim()) {
      setPendingMessages((prev) => [
        ...prev,
        {
          id: `pending-${Date.now()}`,
          text: message.trim(),
          date: new Date(),
          sender: user?.userName ?? 'You',
          isUser: true,
          type: selectedType,
        },
      ]);
    }

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
                onClick={() => handleTypeChange(type.value)}
              >
                {i18n(type.name)}
              </Button>
            );
          })}
        </div>

        <Feed
          messages={messages}
          maxHeight={80}
          maxHeightMeasure={'%'}
          className={styles.feed}
          isLoading={isLoading || isAdding}
          loadingMessage={loadingMessage}
          scrollToMessageId={scrollTarget}
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
