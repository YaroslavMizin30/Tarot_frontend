import { CardName } from '../types';

import { getCardInfo } from './cards';

/**
 * Function signature compatible with `i18n` from `useLocales`.
 */
export type I18nFn = (id: string) => string;

/**
 * Localized card info rendered to UI.
 */
export interface LocalizedCardInfo {
  /**
   * Card identifier
   */
  id: `${CardName}`;
  /**
   * Localized card name
   */
  name: string;
  /**
   * Localized card meanings
   */
  meanings: string;
  /**
   * Localized card description
   */
  description: string;
}

/**
 * Build a localized card info object from the i18n function
 * and a card id.
 *
 * Uses the keys:
 *  - `card.<id>` (or the id itself) for the name
 *  - `card.<id>.meanings` for meanings
 *  - `card.<id>.description` for description
 *
 * If a translation is missing, the original (English) text from
 * the `ALL_CARDS` source-of-truth is used as a fallback.
 */
export const getCardInfoI18n = (
  id: `${CardName}`,
  i18n: I18nFn,
): LocalizedCardInfo | undefined => {
  const card = getCardInfo(id);

  if (!card) {
    return undefined;
  }

  const translate = (key: string, fallback: string): string => {
    const value = i18n(key);
    return value === key ? fallback : value;
  };

  return {
    id: card.id,
    name: i18n(card.id) || card.name,
    meanings: translate(`card.${card.id}.meanings`, card.meanings),
    description: translate(`card.${card.id}.description`, card.description),
  };
};
