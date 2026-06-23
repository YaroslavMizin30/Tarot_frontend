import { useEffect, useRef, type FC } from 'react';

import type { FeedProps, Message } from './Feed.props';

import styles from './Feed.module.css';

const MESSAGE_ID_ATTR = 'data-feed-message-id';

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

  return (
    <div className={styles.container} style={{ maxHeight: `${maxHeight}${maxHeightMeasure}` }}>
      <div className={`${styles.feed} custom-scrollbar ${className}`} ref={feedRef}>
        {messages.length === 0 && !isLoading ? (
          <div className={styles.empty}>No messages yet</div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
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
