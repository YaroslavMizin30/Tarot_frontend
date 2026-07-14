import {
  ALL_CARDS,
  type I18nFn,
  getCardInfoI18n,
} from '@/entities/TarotCard';

/**
 * Build a `paragraphs` array containing all 78 cards' tutorial text.
 *
 * Each card is represented by three paragraphs:
 *  - card name
 *  - "Meanings — <meanings>" / "Значения — <значения>"
 *  - description
 *
 * The function uses the i18n function passed to it so the resulting
 * paragraphs are localized.
 */
const getAllCardsParagraphs = (i18n: I18nFn): string[] => {
  const paragraphs: string[] = [];

  const meaningsLabel = i18n('Meanings');
  const meaningsPrefix = meaningsLabel === 'Meanings'
    ? 'Meanings — '
    : `${meaningsLabel} — `;

  for (const card of ALL_CARDS) {
    const localized = getCardInfoI18n(card.id, i18n);

    if (!localized) {
      continue;
    }

    paragraphs.push(localized.name);
    paragraphs.push(`${meaningsPrefix}${localized.meanings}`);
    paragraphs.push(localized.description);
  }

  return paragraphs;
};

/**
 * "Arcanes" theme — tutorial of all 78 tarot cards.
 */
export const ABOUT_ARCANES = {
  title: 'Arcanes',
  getParagraphs: (i18n: I18nFn) => getAllCardsParagraphs(i18n),
};
