import CARDS from "./cards";


const TRANSLATIONS_EN = {
  ...CARDS,

  // Button labels
  'Spin': 'Spin',
  'Shuffle': 'Shuffle',
  'Rules': 'Rules',

  // Time-related
  'today': 'today',
  'days ago': 'days ago',
  'days (1)': 'day',
  'days (2-4)': 'days',
  'days (5-0)': 'days',

  // Status messages
  'You won': 'You won',
  'Next game is available in': 'Next game is available in',
  "You've spined the wheel today. You can shuffle to spin again.":
    "You've spined the wheel today. You can shuffle to spin again.",
  'For those who like excitement. Reading rules is highly recommended':
    'For those who like excitement. Reading rules is highly recommended',
  'This card has no effects': 'This card has no effects',

  // Rules section
  'Card effects': 'Card effects',
  'The roulette contains 12 sections, each has card. 2 cards have positive effect. 1 card is negative.':
    'The roulette contains 12 sections, each has card. 2 cards have positive effect. 1 card is negative.',
  'You can win a discount, coins, free spreads or horoscopes as well as lose pentacles or bonus effects':
    'You can win a discount, coins, free spreads or horoscopes as well as lose pentacles or bonus effects',
  'Once per day free spin is available. Cards are updated automatically each day or you can update them manually by clicking shuffle button.':
    'Once per day free spin is available. Cards are updated automatically each day or you can update them manually by clicking shuffle button.',
  'In case of win next available spin is after 7 days.':
    'In case of win next available spin is after 7 days.',
  'Descriptions for all card effect are below':
    'Descriptions for all card effect are below',

  // Card prizes (CARDS_DESCRIPTION)
  'Fool. Valid for 30 spreads. Gives 1 pentacle for each time the card Fool comes across reading':
    'Fool. Valid for 30 spreads. Gives 1 pentacle for each time the card Fool comes across reading',
  'Hierophant. Free natal chart creation':
    'Hierophant. Free natal chart creation',
  'Emperor. Gives 10 pentacles at once':
    'Emperor. Gives 10 pentacles at once',
  'World. Gives 5 pentacles at once':
    'World. Gives 5 pentacles at once',
  'Strength. Gives 3 pentacles at once':
    'Strength. Gives 3 pentacles at once',
  'Temperance. Gives 1 pentacle at once':
    'Temperance. Gives 1 pentacle at once',
  'Judgement. Gives 10 free daily horoscopes':
    'Judgement. Gives 10 free daily horoscopes',
  'Magician. Gives 5 free daily horoscopes':
    'Magician. Gives 5 free daily horoscopes',
  'Star. Gives one free monthly horoscope':
    'Star. Gives one free monthly horoscope',
  'Lovers. Gives one free weekly horoscope':
    'Lovers. Gives one free weekly horoscope',
  'Wheel of fortune. Gives 10% off for any purchase':
    'Wheel of fortune. Gives 10% off for any purchase',
  'Hermit. Gives 10 % off for 100 pentacles purchase':
    'Hermit. Gives 10 % off for 100 pentacles purchase',
  'Sun. Gives 10% off for 200 pentacles purchase':
    'Sun. Gives 10% off for 200 pentacles purchase',
  'Chariot. Gives one more try to spin the roulette':
    'Chariot. Gives one more try to spin the roulette',
  'Empress. Gives one free 9 cards reading':
    'Empress. Gives one free 9 cards reading',
  'High priestess. Gives one 7 cards reading':
    'High priestess. Gives one 7 cards reading',
  'Tower. Gives one free 5 cards tarot reading':
    'Tower. Gives one free 5 cards tarot reading',
  'Justice. Gives one free 3 cards tarot reading':
    'Justice. Gives one free 3 cards tarot reading',
  'Moon. Steals 1 pentacle from your balance':
    'Moon. Steals 1 pentacle from your balance',
  'Devil. Steals 3 pentacles from your balance':
    'Devil. Steals 3 pentacles from your balance',
  'Hanged man. Steals 5 pentacles from your balance':
    'Hanged man. Steals 5 pentacles from your balance',
  'Death. Takes away all current bonuses (offs, free horoscopes)':
    'Death. Takes away all current bonuses (offs, free horoscopes)',

  // Card descriptions (PlayingCard descriptions)
  'You receive 1 pentacle for each time the card Fool comes across reading. Valid for 30 readings':
    'You receive 1 pentacle for each time the card Fool comes across reading. Valid for 30 readings',
  'Congratulations! You can receive natal chart for free':
    'Congratulations! You can receive natal chart for free',
  'Congratulations, you receive 10 coins':
    'Congratulations, you receive 10 coins',
  'Congratulations, you receive 5 coins':
    'Congratulations, you receive 5 coins',
  'Congratulations! You receive 10 free daily horoscopes':
    'Congratulations! You receive 10 free daily horoscopes',
  'Congratulations! You receive 5 free daily horoscopes':
    'Congratulations! You receive 5 free daily horoscopes',
  'Congratulations! You receive 10% off for any purchase':
    'Congratulations! You receive 10% off for any purchase',
  'Congratulations! You can receive one free 9 cards tarot reading':
    'Congratulations! You can receive one free 9 cards tarot reading',
  'Congratulations! You can receive one free 7 cards tarot reading':
    'Congratulations! You can receive one free 7 cards tarot reading',
  'Congratulations, you receive 3 coins':
    'Congratulations, you receive 3 coins',
  'Congratulations, you receive 1 coin':
    'Congratulations, you receive 1 coin',
  'Congratulations! You receive one free monthly horoscope':
    'Congratulations! You receive one free monthly horoscope',
  'Congratulations! You receive one free weekly horoscope':
    'Congratulations! You receive one free weekly horoscope',
  'Congratulations! You receive 10% off for 100 pentacles purchase':
    'Congratulations! You receive 10% off for 100 pentacles purchase',
  'Congratulations! You receive 10% off for 200 pentacles purchase':
    'Congratulations! You receive 10% off for 200 pentacles purchase',
  'You can spin the roulette one more time':
    'You can spin the roulette one more time',
  'Congratulations! You can receive one free 5 cards tarot reading':
    'Congratulations! You can receive one free 5 cards tarot reading',
  'Congratulations! You can receive one free 3 cards tarot reading':
    'Congratulations! You can receive one free 3 cards tarot reading',
  'Oh no! 1 pentacle was stolen from your balance':
    'Oh no! 1 pentacle was stolen from your balance',
  'Oh no! 3 pentacles were stolen from your balance':
    'Oh no! 3 pentacles were stolen from your balance',
  'Oh no! 5 pentacles were stolen from your balance':
    'Oh no! 5 pentacles were stolen from your balance',
  'Oh no! All current bonuses have been taken away':
    'Oh no! All current bonuses have been taken away',
};

export default TRANSLATIONS_EN;
