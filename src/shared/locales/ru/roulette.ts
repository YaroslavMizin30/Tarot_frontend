import CARDS from './cards';

const TRANSLATIONS_RU = {
  ...CARDS,

  // Button labels
  'Spin': 'Крутить',
  'Shuffle': 'Перемешать',
  'Rules': 'Правила',
  'Daily card': 'Карта дня',
  'Free card': 'Бесплатная карта',
  'Try your luck': 'Испытать удачу',
  'Open card': 'Открыть карту',
  'Try for 1 pentacle': 'Испытать удачу за 1',
  'Return card': 'Вернуть карту',
  'Return card to the wheel': 'Вернуть карту в колесо',
  'Tap the card to return it': 'Нажмите на карту, чтобы вернуть её',
  'Could not load bonus game': 'Не удалось загрузить бонусную игру',
  'Try again': 'Повторить',
  'Open your daily card first': 'Сначала откройте ежедневную карту',
  'You need 1 bonus pentacle': 'Нужен 1 бонусный пентакль',
  'You have already tried your luck today':
    'Сегодня вы уже испытали удачу',
  'Stake 1 bonus pentacle. Possible payout: 0–4':
    'Ставка — 1 бонусный пентакль. Возможная выплата: 0–4',
  'Purchased balance is never used':
    'Приобретённый баланс не используется',
  'The stake was not returned': 'Ставка не вернулась',
  'Your stake was returned': 'Ваша ставка вернулась',
  'You receive 2 bonus pentacles, including your stake':
    'Вы получаете 2 бонусных пентакля с учётом ставки',
  'You receive 4 bonus pentacles, including your stake':
    'Вы получаете 4 бонусных пентакля с учётом ставки',
  'Your daily card is ready': 'Ваша карта удачи готова',
  'Your daily card has already been opened':
    'Сегодня вы уже открывали карту удачи',
  'Bonus balance': 'Бонусный баланс',
  'Guaranteed reward': 'Гарантированная награда',
  'Pentacles may add currency to your bonus balance':
    'Пентакли могут пополнить бонусный баланс',
  'Wands may give credit toward a tarot reading':
    'Жезлы могут дать бонус для расклада',
  'Cups advance your guaranteed reward meter':
    'Кубки заполняют шкалу гарантированной награды',
  'Swords advance your guaranteed reward meter':
    'Мечи заполняют шкалу гарантированной награды',
  'Major arcana may bring a rare reward':
    'Старшие арканы могут принести редкую награду',
  'The reward meter is complete. You receive 1 bonus pentacle':
    'Шкала заполнена: вы получаете 1 бонусный пентакль',
  'The card advances your guaranteed reward meter':
    'Карта продвигает вас к гарантированной награде',
  'You receive 1 bonus pentacle for a tarot reading':
    'Вы получаете 1 бонусный пентакль для расклада',
  'Jackpot: you receive 5 bonus pentacles':
    'Джекпот: вы получаете 5 бонусных пентаклей',
  'You receive 1 bonus pentacle': 'Вы получаете 1 бонусный пентакль',
  'You receive 2 bonus pentacles': 'Вы получаете 2 бонусных пентакля',
  'You receive 3 bonus pentacles': 'Вы получаете 3 бонусных пентакля',
  'Pentacles add currency to your bonus balance':
    'Пентакли пополняют бонусный баланс',
  'Wands give credit toward your next tarot reading':
    'Жезлы дают бонус для следующего расклада',
  'Cups advance the guaranteed reward meter':
    'Кубки заполняют шкалу гарантированной награды',
  'Swords advance the guaranteed reward meter':
    'Мечи заполняют шкалу гарантированной награды',
  'Major arcana bring rare and more valuable rewards':
    'Старшие арканы приносят редкие и более ценные награды',
  'One free card is available every day. The result is securely selected on the server.':
    'Каждый день доступна одна бесплатная карта. Результат безопасно определяется на сервере.',
  'The game never takes pentacles from your purchased balance.':
    'Игра никогда не списывает пентакли с приобретённого баланса.',
  'Pentacles add bonus currency. Wands help with tarot readings. Cups and swords fill the guaranteed reward meter.':
    'Пентакли дают бонусную валюту, жезлы помогают с раскладами, а кубки и мечи заполняют шкалу гарантированной награды.',
  'Major arcana are rare and bring more valuable rewards. A jackpot can appear no more than once every seven days.':
    'Старшие арканы выпадают редко и дают более ценные награды. Джекпот доступен не чаще одного раза в семь дней.',
  'Bonus pentacles are stored separately from purchased pentacles.':
    'Бонусные пентакли хранятся отдельно от приобретённых.',
  'After opening the daily card, you can risk 1 bonus pentacle once per day.':
    'После ежедневной карты один раз в день можно рискнуть 1 бонусным пентаклем.',
  'The risk game can return 0, 1, 2 or 4 bonus pentacles. Purchased balance is never used.':
    'Рискованная игра может вернуть 0, 1, 2 или 4 бонусных пентакля. Приобретённый баланс не используется.',

  // Time-related
  'today': 'сегодня',
  'days ago': 'назад',
  'days (1)': 'день',
  'days (2-4)': 'дня',
  'days (5-0)': 'дней',

  // Status messages
  'You won': 'Вы выиграли',
  'Next game is available in': 'Следующая игра доступна через',
  "You've spined the wheel today. You can shuffle to spin again.":
    'Вы уже крутили колесо сегодня. Вы можете перемешать карты, чтобы крутить снова.',
  'For those who like excitement. Reading rules is highly recommended':
    'Для тех, кто любит азарт. Настоятельно рекомендуется прочитать правила',
  'This card has no effects': 'У этой карты нет эффектов',

  // Rules section
  'Card effects': 'Эффекты карт',
  'What the cards mean': 'Что означают карты',
  'Your daily card': 'Ежедневная карта',
  'If you want to take a risk': 'Если хочется рискнуть',
  'How bonuses are used': 'Как используются бонусы',
  'Open one free card every day. It will give you a bonus or move you closer to a guaranteed reward.':
    'Каждый день можно бесплатно открыть одну карту. Она даст бонус или приблизит гарантированную награду.',
  'Purchased pentacles are safe and are never charged by the game.':
    'Купленные пентакли в безопасности: игра никогда их не списывает.',
  'After the daily card, you can try your luck once. The stake is 1 bonus pentacle.':
    'После ежедневной карты можно один раз испытать удачу. Ставка — 1 бонусный пентакль.',
  'A payout of 0 loses the stake, 1 returns it, 2 gives 1 pentacle of profit, and 4 gives 3 pentacles of profit.':
    'Выплата 0 означает потерю ставки, 1 возвращает её, 2 дают прибыль в 1 пентакль, а 4 — прибыль в 3 пентакля.',
  'This mode is optional. You can keep your bonus and leave without playing.':
    'Рисковать необязательно: бонус можно сохранить и просто выйти.',
  'Bonus pentacles are stored separately and are used first when you pay for a tarot reading.':
    'Бонусные пентакли хранятся отдельно и первыми расходуются при оплате расклада.',
  'The roulette contains 12 sections, each has card. 2 cards have positive effect. 1 card is negative.':
    'Рулетка содержит 12 секций, в каждой по карте. 2 карты имеют положительный эффект. 1 карта — отрицательный.',
  'You can win a discount, coins, free spreads or horoscopes as well as lose pentacles or bonus effects':
    'Вы можете выиграть скидку, монеты, бесплатные расклады или гороскопы, а также потерять пентакли или бонусные эффекты',
  'Once per day free spin is available. Cards are updated automatically each day or you can update them manually by clicking shuffle button.':
    'Один раз в день доступно бесплатное вращение. Карты обновляются автоматически каждый день, или вы можете обновить их вручную, нажав кнопку перемешивания.',
  'In case of win next available spin is after 7 days.':
    'В случае выигрыша следующее вращение будет доступно через 7 дней.',
  'Descriptions for all card effect are below':
    'Описания всех эффектов карт приведены ниже',

  // Card prizes (CARDS_DESCRIPTION)
  'Fool. Valid for 30 spreads. Gives 1 pentacle for each time the card Fool comes across reading':
    'Шут. Действителен на 30 раскладов. Даёт 1 пентакль за каждую карту Шут в раскладе',
  'Hierophant. Free natal chart creation':
    'Верховный жрец. Бесплатное создание натальной карты',
  'Emperor. Gives 10 pentacles at once':
    'Император. Даёт 10 пентаклей сразу',
  'World. Gives 5 pentacles at once':
    'Мир. Даёт 5 пентаклей сразу',
  'Strength. Gives 3 pentacles at once':
    'Сила. Даёт 3 пентакля сразу',
  'Temperance. Gives 1 pentacle at once':
    'Умеренность. Даёт 1 пентакль сразу',
  'Judgement. Gives 10 free daily horoscopes':
    'Суд. Даёт 10 бесплатных ежедневных гороскопов',
  'Magician. Gives 5 free daily horoscopes':
    'Маг. Даёт 5 бесплатных ежедневных гороскопов',
  'Star. Gives one free monthly horoscope':
    'Звезда. Даёт один бесплатный гороскоп на месяц',
  'Lovers. Gives one free weekly horoscope':
    'Влюбленные. Дают один бесплатный гороскоп на неделю',
  'Wheel of fortune. Gives 10% off for any purchase':
    'Колесо Фортуны. Даёт скидку 10% на любую покупку',
  'Hermit. Gives 10 % off for 100 pentacles purchase':
    'Отшельник. Даёт скидку 10% на покупку за 100 пентаклей',
  'Sun. Gives 10% off for 200 pentacles purchase':
    'Солнце. Даёт скидку 10% на покупку за 200 пентаклей',
  'Chariot. Gives one more try to spin the roulette':
    'Колесница. Даёт ещё одну попытку крутить рулетку',
  'Empress. Gives one free 9 cards reading':
    'Императрица. Даёт один бесплатный расклад на 9 карт',
  'High priestess. Gives one 7 cards reading':
    'Верховная Жрица. Даёт один расклад на 7 карт',
  'Tower. Gives one free 5 cards tarot reading':
    'Башня. Даёт один бесплатный расклад на 5 карт',
  'Justice. Gives one free 3 cards tarot reading':
    'Справедливость. Даёт один бесплатный расклад на 3 карты',
  'Moon. Steals 1 pentacle from your balance':
    'Луна. Крадёт 1 пентакль с вашего баланса',
  'Devil. Steals 3 pentacles from your balance':
    'Дьявол. Крадёт 3 пентакля с вашего баланса',
  'Hanged man. Steals 5 pentacles from your balance':
    'Повешенный. Крадёт 5 пентаклей с вашего баланса',
  'Death. Takes away all current bonuses (offs, free horoscopes)':
    'Смерть. Забирает все текущие бонусы (скидки, бесплатные гороскопы)',

  // Card descriptions (PlayingCard descriptions)
  'You receive 1 pentacle for each time the card Fool comes across reading. Valid for 30 readings':
    'Вы получаете 1 пентакль за каждое выпадение карты Шут в раскладе. Действительно на 30 раскладов',
  'Congratulations! You can receive natal chart for free':
    'Поздравляем! Вы можете получить натальную карту бесплатно',
  'Congratulations, you receive 10 coins':
    'Поздравляем, вы получаете 10 монет',
  'Congratulations, you receive 5 coins':
    'Поздравляем, вы получаете 5 монет',
  'Congratulations! You receive 10 free daily horoscopes':
    'Поздравляем! Вы получаете 10 бесплатных ежедневных гороскопов',
  'Congratulations! You receive 5 free daily horoscopes':
    'Поздравляем! Вы получаете 5 бесплатных ежедневных гороскопов',
  'Congratulations! You receive 10% off for any purchase':
    'Поздравляем! Вы получаете скидку 10% на любую покупку',
  'Congratulations! You can receive one free 9 cards tarot reading':
    'Поздравляем! Вы можете получить один бесплатный расклад Таро на 9 карт',
  'Congratulations! You can receive one free 7 cards tarot reading':
    'Поздравляем! Вы можете получить один бесплатный расклад Таро на 7 карт',
  'Congratulations, you receive 3 coins':
    'Поздравляем, вы получаете 3 монеты',
  'Congratulations, you receive 1 coin':
    'Поздравляем, вы получаете 1 монету',
  'Congratulations! You receive one free monthly horoscope':
    'Поздравляем! Вы получаете один бесплатный месячный гороскоп',
  'Congratulations! You receive one free weekly horoscope':
    'Поздравляем! Вы получаете один бесплатный недельный гороскоп',
  'Congratulations! You receive 10% off for 100 pentacles purchase':
    'Поздравляем! Вы получаете скидку 10% на покупку за 100 пентаклей',
  'Congratulations! You receive 10% off for 200 pentacles purchase':
    'Поздравляем! Вы получаете скидку 10% на покупку за 200 пентаклей',
  'You can spin the roulette one more time':
    'Вы можете крутить рулетку ещё один раз',
  'Congratulations! You can receive one free 5 cards tarot reading':
    'Поздравляем! Вы можете получить один бесплатный расклад Таро на 5 карт',
  'Congratulations! You can receive one free 3 cards tarot reading':
    'Поздравляем! Вы можете получить один бесплатный расклад Таро на 3 карты',
  'Oh no! 1 pentacle was stolen from your balance':
    'О нет! 1 пентакль был украден с вашего баланса',
  'Oh no! 3 pentacles were stolen from your balance':
    'О нет! 3 пентакля были украдены с вашего баланса',
  'Oh no! 5 pentacles were stolen from your balance':
    'О нет! 5 пентаклей были украдены с вашего баланса',
  'Oh no! All current bonuses have been taken away':
    'О нет! Все текущие бонусы были отобраны',
};

export default TRANSLATIONS_RU;
