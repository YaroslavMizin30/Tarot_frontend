import { CardName } from '@/entities/TarotCard';

import type { Effect, PlayingCard } from '../types';

export const CARDS_DESCRIPTION: {
  id: `${CardName}`;
  prize: string;
  effect: Effect;
}[] = [
  // счастливая карта
  {
    id: 'fool',
    prize:
      'Fool. Valid for 30 spreads. Gives 1 pentacle for each time the card Fool comes across reading',
    effect: 'happy-card',
  },
  // натальная карта
  {
    id: 'hierophant',
    prize: 'Hierophant. Free natal chart creation',
    effect: 'natal',
  },

  // монеты
  {
    id: 'emperor',
    prize: 'Emperor. Gives 10 pentacles at once',
    effect: 'coins',
  },
  { id: 'world', prize: 'World. Gives 5 pentacles at once', effect: 'coins' },
  {
    id: 'strength',
    prize: 'Strength. Gives 3 pentacles at once',
    effect: 'coins',
  },
  {
    id: 'temperance',
    prize: 'Temperance. Gives 1 pentacle at once',
    effect: 'coins',
  },

  // гороскопы
  {
    id: 'judgement',
    prize: 'Judgement. Gives 10 free daily horoscopes',
    effect: 'horoscopes',
  },
  {
    id: 'magician',
    prize: 'Magician. Gives 5 free daily horoscopes',
    effect: 'horoscopes',
  },
  {
    id: 'star',
    prize: 'Star. Gives one free monthly horoscope',
    effect: 'horoscopes',
  },
  {
    id: 'lovers',
    prize: 'Lovers. Gives one free weekly horoscope',
    effect: 'horoscopes',
  },

  // скидки
  {
    id: 'wheel_of_fortune',
    prize: 'Wheel of fortune. Gives 10% off for any purchase',
    effect: 'offs',
  },
  {
    id: 'hermit',
    prize: 'Hermit. Gives 10 % off for 100 pentacles purchase',
    effect: 'offs',
  },
  {
    id: 'sun',
    prize: 'Sun. Gives 10% off for 200 pentacles purchase',
    effect: 'offs',
  },

  // ретрай
  {
    id: 'chariot',
    prize: 'Chariot. Gives one more try to spin the roulette',
    effect: 'retry',
  },

  //расклады
  {
    id: 'empress',
    prize: 'Empress. Gives one free 9 cards reading',
    effect: 'reading',
  },
  {
    id: 'high_priestess',
    prize: 'High priestess. Gives one 7 cards reading',
    effect: 'reading',
  },
  {
    id: 'tower',
    prize: 'Tower. Gives one free 5 cards tarot reading',
    effect: 'reading',
  },
  {
    id: 'justice',
    prize: 'Justice. Gives one free 3 cards tarot reading',
    effect: 'reading',
  },

  // отрицательные эффекты
  {
    id: 'moon',
    prize: 'Moon. Steals 1 pentacle from your balance',
    effect: 'negative',
  },
  {
    id: 'devil',
    prize: 'Devil. Steals 3 pentacles from your balance',
    effect: 'negative',
  },
  {
    id: 'hanged_man',
    prize: 'Hanged man. Steals 5 pentacles from your balance',
    effect: 'negative',
  },
  {
    id: 'death',
    prize: 'Death. Takes away all current bonuses (offs, free horoscopes)',
    effect: 'negative',
  },
];

export const HIGH_CARDS: PlayingCard[] = [
  {
    id: CardName.THE_FOOL,
    effect: 'happy-card',
    description:
      'You receive 1 pentacle for each time the card Fool comes across reading. Valid for 30 readings',
  },
  {
    id: CardName.THE_HIEROPHANT,
    effect: 'natal',
    description: 'Congratulations! You can receive natal chart for free',
  },
  {
    id: CardName.THE_EMPEROR,
    effect: 'coins',
    description: 'Congratulations, you receive 10 coins',
  },
  {
    id: CardName.THE_WORLD,
    effect: 'coins',
    description: 'Congratulations, you receive 5 coins',
  },
  {
    id: CardName.JUDGEMENT,
    effect: 'horoscopes',
    description: 'Congratulations! You receive 10 free daily horoscopes',
  },
  {
    id: CardName.THE_MAGICIAN,
    effect: 'horoscopes',
    description: 'Congratulations! You receive 5 free daily horoscopes',
  },
  {
    id: CardName.WHEEL_OF_FORTUNE,
    effect: 'offs',
    description: 'Congratulations! You receive 10% off for any purchase',
  },
  {
    id: CardName.THE_EMPRESS,
    effect: 'reading',
    description:
      'Congratulations! You can receive one free 9 cards tarot reading',
  },
  {
    id: CardName.THE_HIGH_PRIESTESS,
    effect: 'reading',
    description:
      'Congratulations! You can receive one free 7 cards tarot reading',
  },
];

export const MIDDLE_CARDS: PlayingCard[] = [
  {
    id: CardName.STRENGTH,
    effect: 'coins',
    description: 'Congratulations, you receive 3 coins',
  },
  {
    id: CardName.TEMPERANCE,
    effect: 'coins',
    description: 'Congratulations, you receive 1 coin',
  },
  {
    id: CardName.THE_STAR,
    effect: 'horoscopes',
    description: 'Congratulations! You receive one free monthly horoscope',
  },
  {
    id: CardName.THE_LOVERS,
    effect: 'horoscopes',
    description: 'Congratulations! You receive one free weekly horoscope',
  },
  {
    id: CardName.THE_HERMIT,
    effect: 'offs',
    description:
      'Congratulations! You receive 10% off for 100 pentacles purchase',
  },
  {
    id: CardName.THE_SUN,
    effect: 'offs',
    description:
      'Congratulations! You receive 10% off for 200 pentacles purchase',
  },
  {
    id: CardName.THE_CHARIOT,
    effect: 'retry',
    description: 'You can spin the roulette one more time',
  },
  {
    id: CardName.THE_TOWER,
    effect: 'reading',
    description:
      'Congratulations! You can receive one free 5 cards tarot reading',
  },
  {
    id: CardName.JUSTICE,
    effect: 'reading',
    description:
      'Congratulations! You can receive one free 3 cards tarot reading',
  },
];

export const NEGATIVE_CARDS: PlayingCard[] = [
  {
    id: CardName.THE_MOON,
    effect: 'negative',
    description: 'Oh no! 1 pentacle was stolen from your balance',
  },
  {
    id: CardName.THE_DEVIL,
    effect: 'negative',
    description: 'Oh no! 3 pentacles were stolen from your balance',
  },
  {
    id: CardName.THE_HANGED_MAN,
    effect: 'negative',
    description: 'Oh no! 5 pentacles were stolen from your balance',
  },
  {
    id: CardName.DEATH,
    effect: 'negative',
    description: 'Oh no! All current bonuses have been taken away',
  },
];

export const REST: PlayingCard[] = [
  { id: CardName.ACE_OF_COINS },
  { id: CardName.ACE_OF_CUPS },
  { id: CardName.ACE_OF_SWORDS },
  { id: CardName.ACE_OF_WANDS },
  { id: CardName.KING_OF_COINS },
  { id: CardName.KING_OF_CUPS },
  { id: CardName.KING_OF_SWORDS },
  { id: CardName.KING_OF_WANDS },
  { id: CardName.KNIGHT_OF_COINS },
  { id: CardName.KNIGHT_OF_CUPS },
  { id: CardName.KNIGHT_OF_SWORDS },
  { id: CardName.KNIGHT_OF_WANDS },
  { id: CardName.QUEEN_OF_COINS },
  { id: CardName.QUEEN_OF_CUPS },
  { id: CardName.QUEEN_OF_SWORDS },
  { id: CardName.QUEEN_OF_WANDS },
  { id: CardName.PAGE_OF_COINS },
  { id: CardName.PAGE_OF_CUPS },
  { id: CardName.PAGE_OF_SWORDS },
  { id: CardName.PAGE_OF_WANDS },
  { id: CardName.TEN_OF_COINS },
  { id: CardName.TEN_OF_CUPS },
  { id: CardName.TEN_OF_SWORDS },
  { id: CardName.TEN_OF_WANDS },
  { id: CardName.NINE_OF_COINS },
  { id: CardName.NINE_OF_CUPS },
  { id: CardName.NINE_OF_SWORDS },
  { id: CardName.NINE_OF_WANDS },
  { id: CardName.EIGHT_OF_CUPS },
  { id: CardName.EIGHT_OF_SWORDS },
  { id: CardName.EIGHT_OF_COINS },
  { id: CardName.EIGHT_OF_WANDS },
  { id: CardName.SEVEN_OF_COINS },
  { id: CardName.SEVEN_OF_CUPS },
  { id: CardName.SEVEN_OF_SWORDS },
  { id: CardName.SEVEN_OF_WANDS },
  { id: CardName.SIX_OF_COINS },
  { id: CardName.SIX_OF_CUPS },
  { id: CardName.SIX_OF_SWORDS },
  { id: CardName.SIX_OF_WANDS },
  { id: CardName.FIVE_OF_COINS },
  { id: CardName.FIVE_OF_CUPS },
  { id: CardName.FIVE_OF_SWORDS },
  { id: CardName.FIVE_OF_WANDS },
  { id: CardName.FOUR_OF_COINS },
  { id: CardName.FOUR_OF_CUPS },
  { id: CardName.FOUR_OF_SWORDS },
  { id: CardName.FOUR_OF_WANDS },
  { id: CardName.THREE_OF_COINS },
  { id: CardName.THREE_OF_CUPS },
  { id: CardName.THREE_OF_SWORDS },
  { id: CardName.THREE_OF_WANDS },
  { id: CardName.TWO_OF_COINS },
  { id: CardName.TWO_OF_CUPS },
  { id: CardName.TWO_OF_SWORDS },
  { id: CardName.TWO_OF_WANDS },
];
