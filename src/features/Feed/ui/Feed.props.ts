export interface Message {
  id: string;
  text: string;
  date: Date;
  sender: string;
  avatar?: string;
  /** When true, the message bubble is aligned to the right (user's own messages) */
  isUser: boolean;
  /** Optional horoscope type (daily/weekly/monthly) shown as a badge */
  type?: 'daily' | 'weekly' | 'monthly';
}

export interface FeedProps {
  /** Messages to display in the feed */
  messages: Message[];
  /** Additional CSS classes */
  className?: string;
  /** Maximal height of the feed container */
  maxHeight: number;
  /** The measure of max height */
  maxHeightMeasure: 'px' | '%';
  /** When set to a message id, the feed scrolls to that message */
  scrollToMessageId?: string | null;
  /** Show a loading indicator inside the feed */
  isLoading?: boolean;
  /** Custom loading message shown while loading */
  loadingMessage?: string;
}
