import { type SupabaseClient } from '@supabase/supabase-js';

interface WebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
}

interface WebAppInitData {
  query_id?: string;
  user?: WebAppUser;
  receiver?: WebAppUser;
  chat?: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

interface WebApp {
  initData: string;
  initDataUnsafe: WebAppInitData;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    header_bg_color?: string;
    accent_text_color?: string;
    section_bg_color?: string;
    section_header_text_color?: string;
    subsection_bg_color?: string;
    destructive_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
  };
  HapticFeedback: {
    impactOccurred(
      style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
    ): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  CloudStorage: {
    getItem(
      key: string,
      callback: (error: Error | null, value: string | null) => void,
    ): void;
    getItems(
      keys: string[],
      callback: (error: Error | null, result: Record<string, string>) => void,
    ): void;
    setItem(
      key: string,
      value: string,
      callback: (error: Error | null) => void,
    ): void;
    setItems(
      items: Record<string, string>,
      callback: (error: Error | null) => void,
    ): void;
    removeItem(key: string, callback: (error: Error | null) => void): void;
    removeItems(keys: string[], callback: (error: Error | null) => void): void;
    getKeys(callback: (error: Error | null, keys: string[]) => void): void;
  };
  BiometricManager: {
    isBiometricAvailable(): Promise<boolean>;
    authenticate(reason: string): Promise<boolean>;
    enrollBiometric(params: { reason: string }): Promise<void>;
    destroy(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  sendData(data: string): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  setBottomBarColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  // eslint-disable-next-line
  onEvent(eventType: string, callback: (eventData: any) => void): void;
  // eslint-disable-next-line
  offEvent(eventType: string, callback: (eventData: any) => void): void;
  isVersionAtLeast(version: string): boolean;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  openInvoice(
    url: string,
    callback: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void,
  ): void;
  readTextFromClipboard(callback: (text: string | null) => void): void;
  requestWriteAccess(callback: (access: boolean) => void): void;
  requestContact(callback: (contact: WebAppUser | null) => void): void;
  shareToStory(
    media_url: string,
    params?: { text?: string; widget_link?: { url: string; name?: string } },
  ): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
    supabase: SupabaseClient;
  }
}

export type { WebApp, WebAppUser, WebAppInitData };

declare module 'snakeize';
