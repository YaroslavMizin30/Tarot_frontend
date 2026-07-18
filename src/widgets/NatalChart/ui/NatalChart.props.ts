import type { User } from '@/entities/User';

export interface NatalChartProps {
  user: User;
  /**
   * Optional className for the root container
   */
  className?: string;
  /**
   * Optional callback invoked after the chart has been successfully updated
   * (and the user data has been refetched).
   */
  onUpdated?: () => void;
  /** Navigate back from the natal chart page. */
  onBack?: () => void;
}
