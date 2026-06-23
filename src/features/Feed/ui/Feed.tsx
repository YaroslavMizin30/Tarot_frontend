import { useEffect, useRef, type FC, type ReactNode } from 'react';

import type { FeedProps, Message } from './Feed.props';

import styles from './Feed.module.css';

const MESSAGE_ID_ATTR = 'data-feed-message-id';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatDateLabel = (date: Date): string => {
  const now = new Date();
  const todayKey = getDateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday);
  const dateKey = getDateKey(date);

  if (dateKey === todayKey) {
    return 'Today';
  }

  if (dateKey === yesterdayKey) {
    return 'Yesterday';
  }

  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/** Renders a date separator line between message groups */
const DateSeparator: FC<{ label: string }> = ({ label }) => {
  return (
    <div className={styles.dateSeparator}>
      <span className={styles.dateSeparatorLine} />
      <span className={styles.dateSeparatorLabel}>{label}</span>
      <span className={styles.dateSeparatorLine} />
    </div>
  );
};

const MessageItem: FC<{ message: Message }> = ({ message }) => {
  const alignmentClass = message.isUser ? styles.messageUser : styles.messageOther;

  return (
    <div className={`${styles.message} ${alignmentClass}`} data-feed-message-id={message.id}>
      {message.avatar ? (
        <img
          className={styles.avatar}
          src={message.avatar}
          alt={`${message.sender} avatar`}
        />
      ) : (
        <div className={styles.avatarPlaceholder}>
          {getInitials(message.sender)}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.sender}>{message.sender}</span>
          <span className={styles.date}>{formatTime(message.date)}</span>
        </div>
        <span className={styles.text}>{message.text}</span>
      </div>
    </div>
  );
};

const LoadingDots: FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <span className={styles.loadingDot} />
      <span className={styles.loadingDot} />
      <span className={styles.loadingDot} />
    </div>
  );
};

export const Feed: FC<FeedProps> = (props) => {
  const {
    messages,
    className = '',
    maxHeight,
    maxHeightMeasure,
    scrollToMessageId,
    isLoading = false,
    loadingMessage = 'Thinking',
  } = props;

  const feedRef = useRef<HTMLDivElement>(null);

  /* eslint-disable */
  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (!feedRef.current) {
      return;
    }

    feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages.length]);
  /* eslint-enable */

  // Scroll to the target message when scrollToMessageId changes
  useEffect(() => {
    if (!scrollToMessageId || !feedRef.current) {
      return;
    }

    const target = feedRef.current.querySelector(
      `[${MESSAGE_ID_ATTR}="${scrollToMessageId}"]`,
    );

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollToMessageId]);

  // Group messages by date and render with separators
  const renderMessages = () => {
    if (messages.length === 0) {
      return null;
    }

    const elements: ReactNode[] = [];
    let lastDateKey: string | null = null;

    messages.forEach((message) => {
      const dateKey = getDateKey(message.date);

      if (dateKey !== lastDateKey) {
        elements.push(
          <DateSeparator key={`sep-${dateKey}`} label={formatDateLabel(message.date)} />,
        );
        lastDateKey = dateKey;
      }

      elements.push(
        <MessageItem key={message.id} message={message} />,
      );
    });

    return elements;
  };

  return (
    <div className={styles.container} style={{ maxHeight: `${maxHeight}${maxHeightMeasure}` }}>
      <div className={`${styles.feed} custom-scrollbar ${className}`} ref={feedRef}>
        {messages.length === 0 && !isLoading ? (
          <div className={styles.empty}>No messages yet</div>
        ) : (
          renderMessages()
        )}

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.loadingMessage}>{loadingMessage}</div>
            <LoadingDots />
          </div>
        )}
      </div>
    </div>
  );
};
