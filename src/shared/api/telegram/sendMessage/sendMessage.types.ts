export type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove
  | ForceReply;

export interface InlineKeyboardMarkup {
  inlineKeyboard: InlineKeyboardButton[][];
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callbackData?: string;
  webApp?: { url: string };
  loginUrl?: LoginUrl;
  switchInlineQuery?: string;
  switchInlineQueryCurrentChat?: string;
  callbackGame?: Record<string, never>;
  pay?: boolean;
}

export interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][];
  isPersistent?: boolean;
  resizeKeyboard?: boolean;
  oneTimeKeyboard?: boolean;
  inputFieldPlaceholder?: string;
  selective?: boolean;
}

export interface KeyboardButton {
  text: string;
  requestContact?: boolean;
  requestLocation?: boolean;
  requestPoll?: { type?: 'quiz' | 'regular' };
  webApp?: { url: string };
}

export interface ReplyKeyboardRemove {
  removeKeyboard: true;
  selective?: boolean;
}

export interface ForceReply {
  forceReply: true;
  inputFieldPlaceholder?: string;
  selective?: boolean;
}

export interface LoginUrl {
  url: string;
  forwardText?: string;
  botUsername?: string;
  requestWriteAccess?: boolean;
}

export interface SendTelegramMessageOptions {
  chatId: string | number;
  text: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  replyMarkup?: ReplyMarkup;
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
  protectContent?: boolean;
}

export interface SendMessageParams {
  text: string;
  replyMarkup?: ReplyMarkup;
}

export interface SendMessageResponse {
  messageId: number;
  from: {
    id: number;
    isBot: boolean;
    firstName: string;
    username: string;
  };
  chat: {
    id: number;
    firstName: string;
    username: string;
    type: 'private' | 'public';
  };
  date: number;
  text: string;
}
