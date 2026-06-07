import CARDS from './cards';

const TRANSLATIONS_RU: Record<string, string> = {
  'Topics': 'Темы раскладов',

  // Темы
  'Anxiety and uncertainty': 'Тревога и неопределённость',
  'Decision Making': 'Принятие решений',
  'Relationships and love': 'Отношения и любовь',
  'Work, career, self-realization': 'Работа, карьера, самореализация',
  'Money and business': 'Деньги и проекты/бизнес',
  'Self-knowledge and crises': 'Самопознание и кризисы',
  'Emotional relief': 'Эмоциональная разгрузка',
  'Spirituality and the Path': 'Духовность и путь',
  'Rituals of transformation': 'Ритуалы перехода',
  'Intuition vs. rationality': 'Интуиция vs рациональность',
  'My own question': 'Свой вопрос',

  // Вопросы
  'General anxiety about the future': 'Общая тревога о будущем',
  'Fear of the unknown': 'Страх перед неизвестностью',
  'Uncertainty in life': 'Неопределённость в жизни',
  'Choosing between options': 'Выбор между вариантами',
  'Fear of making a mistake in decision': 'Страх ошибки в решении',
  'Passing the buck': 'Перекладывание ответственности',
  'Love and relationships now': 'Любовь и отношения сейчас',
  "The couple's future": 'Будущее пары',
  'Returning to an ex': 'Возвращение к бывшему',
  'Dating a new person': 'Новый человек / свидания',
  'Scenarios in love': 'Сценарии в любви',
  'Compatibility': 'Совместимость',
  'Breakup': 'Разрыв / расставание',
  'Loneliness and "the one"': 'Одиночество и "тот самый""',
  'Cheating and betrayal"': 'Измены и предательство"',
  'Crisis in a couple': 'Кризис в паре',
  'Self-esteem in love': 'Самооценка в любви',
  'Change of profession': 'Смена работы/профессии',
  'Finding your "thing"': 'Поиск "своего дела"',
  'Doubts about offers': 'Сомнения по офферам',
  'Launching a project/business': 'Запуск проекта/бизнеса',
  'Blind spots in the project': 'Слепые зоны в проекте',
  'Risk assessment': 'Оценка рисков',
  'Stuck on autopilot': 'Застрял на автопилоте',
  'Search for wishes': 'Поиск желаний',
  'Crises of meaning/age': 'Кризисы смысла/возраста',
  'Speak out through cards': 'Выговориться через карты',
  'Name feelings': 'Назвать чувства',
  'Connection to the Greater': 'Связь с "большим"',
  'Meanings of events': 'Смыслы в событиях',
  'New stage of life': 'Новый этап жизни',
  'Completing the cycle': 'Завершение цикла',
  'Intuitive advice': 'Интуитивный совет',
  'Figurative language': 'Образный язык',

  // Тексты
  'What awaits me in the coming months? Possible scenarios.':
    'Что ждёт меня в ближайшие месяцы? Возможные сценарии.',
  'What risks and opportunities lie ahead? How to prepare.':
    'Какие риски и возможности впереди? Как подготовиться.',
  'Why is everything unstable? What stabilizes the situation?':
    'Почему всё нестабильно? Что стабилизирует ситуацию.',
  'Which path to choose? Pros and cons of each.':
    'Какой путь выбрать? Плюсы/минусы каждого.',
  'Is this the right move? Support from the Universe.':
    'Правильный ли это шаг? Поддержка Вселенной.',
  'What do the cards advise to do in this situation?':
    'Что карты советуют сделать в этой ситуации?',
  "What's going on between me and my partner? Feelings, motives.":
    'Что происходит между мной и партнёром? Чувства, мотивы.',
  'Is there a chance for our relationship? What lies ahead.':
    'Есть ли шанс у наших отношений? Что впереди.',
  "Should I return it? Partner's thoughts, conclusion.":
    'Стоит ли возвращать? Мысли партнёра, итог.',
  'How does he(she) feel? Prospects.': 'Что он/она чувствует? Перспективы.',
  'Why do mistakes repeat themselves? How to break the cycle.':
    'Почему повторяются ошибки? Как сломать круг.',
  'Are we a good fit? Strengths/Weaknesses.':
    'Подходим ли мы? Сильные/слабые стороны.',
  'Am I leaving correctly? How to let go.':
    'Правильно ли ухожу? Как отпустить.',
  "When will I meet my partner? What's blocking me?":
    'Когда встречу партнёра? Что блокирует.',
  'Is there a third party? What to do.': 'Есть ли кто-то третий? Что делать.',
  'What destroys? How to restore.': 'Что разрушает? Как восстановить.',
  'Why do I choose the "wrong ones"? How to love yourself.':
    'Почему выбираю "не тех"? Как полюбить себя.',
  'Where to go? Is this "my" job?': 'Куда двигаться? Это "моё" дело?',
  'What are my talents? Where can I find fulfillment?':
    'В чём мои таланты? Где реализация.',
  'Which offer to choose? The risks of each.':
    'Какой офер выбрать? Риски каждого.',
  "What's hindering growth? Strategy adjustments.":
    'Что мешает росту? Корректировка стратегии.',
  'Obstacles, resources, growth points.': 'Препятствия, ресурсы, точки роста.',
  'Investment/Partnership Risks? Summary.':
    'Риски инвестиций/партнёрств? Итог.',
  'What are my true desires? What needs to be changed?':
    'Мои истинные желания? Что менять.',
  'What do I really want?': 'Чего я хочу на самом деле?',
  'The logic of my story? New meaning.': 'Логика моей истории? Новый смысл.',
  'What hurts inside? A gentle analysis.': 'Что болит внутри? Бережный разбор.',
  'What do I feel? How to experience': 'Что я чувствую? Как прожить.',
  'My path, signs of the Universe.': 'Мой путь, знаки Вселенной.',
  'Why did this happen to me?': 'Зачем это произошло со мной?',
  'Support at the start: moving, year, relationships.':
    'Поддержка на старте: переезд, год, отношения.',
  'What to let go of? What to take into the new.':
    'Что отпустить? Что взять в новое.',
  'What does your gut tell you? Symbols.': 'Что подсказывает чутьё? Символы.',
  'Metaphors for my questions.': 'Метафоры для моих вопросов.',

  // Названия раскладов
  'Life horizon': 'Горизонт жизни',
  'The fog is clearing': 'Туман рассеивается',
  'Support in chaos': 'Опора в хаосе',
  'Three roads': 'Три дороги',
  'Sign of fate': 'Знак судьбы',
  'Advice of the sage': 'Совет мудреца',
  'Relationship triangle': 'Треугольник отношений',
  'The path of love': 'Путь любви',
  'Bridge back': 'Мост назад',
  'Chemistry at the start': 'Химия на старте',
  'Karmic love': 'Кармическая любовь',
  'Two decks': 'Две колоды',
  'The door is closed': 'Дверь закрыта',
  'Star of love': 'Звезда любви',
  'Mystery revealed': 'Тайна раскрыта',
  'Storm in a relationship': 'Шторм в отношениях',
  'Mirror of the Soul': 'Зеркало души',
  'Career turnaround': 'Карьерный поворот',
  'Call of Destiny': 'Зов предназначения',
  'Two jobs': 'Две работы',
  'Business Impulse': 'Бизнес-импульс',
  'Business diagnosis': 'Диагностика дела',
  'Weighing the odds': 'Взвешивание шансов',
  'Awakening': 'Пробуждение',
  'The heart speaks': 'Сердце говорит',
  'Puzzle of life': 'Пазл жизни',
  'A heart-to-heart talk': 'Разговор по душам',
  'Emotions in the open': 'Эмоции начистоту',
  'Spiritual compass': 'Духовный компас',
  'Lesson of fate': 'Урок судьбы',
  'New moon': 'Новолуние',
  'Liberation': 'Освобождение',
  'The voice of intuition': 'Голос интуиции',
  'Tale of cards': 'Сказка карт',

  // Детали вопросов
  'What are your options?': 'Между чем выбираете?',
  'Your options': 'Ваши варианты',
  'What is the decision about?': 'Какое решение Вы хотите предпринять?',
  'The decision': 'Ваше решение',
  'What is the situation?': 'Какая ситуация беспокоит Вас?',
  'The situation': 'Моя ситуация',
  'What are the mistakes you want to fix?':
    'Какие ошибки Вы бы хотели исправить?',
  'Mistakes I want to fix': 'Ошибки, которые я хочу исправить',
  'Why do you think you choose the "wrong ones"?':
    'Почему Вы полагаете, что выбираете не тех?',
  'I choose the "wrong ones because': 'Я выбираю не тех, по причинам',
  'What is your current profession?': 'Какая Ваша профессия в данный момент?',
  'My current profession': 'Моя текущая профессия',
  'What are the offers you are considering?':
    'Между какими оффрерами Вы рассматриваете?',
  'The offers I am considering are': 'Офферы, которые я рассматриваю',
  'What is your current business?': 'Каким бизнесом Вы сейчас занимаетесь?',
  'My current business': 'Мой бизнес на данный момент',
  'Details are required': 'Для точного анализа нужны детали',

  'Type here...': 'Пишите сюда...',

  'Question': 'Вопрос',
  'Spread': 'Расклад',
  'Select spread': 'Выберите расклад',
  'Ready?': 'Готовы?',
  'Click': 'Разложить',

  'cards(nominative)': 'карты',
  'cards(accusative)': 'карт',
  'card': 'карта',

  'Interpretation': 'К интерпретации',

  'Single Card': 'Одна карта',
  'Three Cards': 'Три карты',
  'Pentagram': 'Петаграмма',
  'Need tarot spread interpretation': 'Нужна интерпретация для расклада таро',
  'Spread title': 'Название расклада',
  'Cards': 'Карты',
  'Do not talk about user as a third person':
    'Не указывать в ответе ссылки на самого пользователя в третьем лице',
  'To spreads history': 'К истории раскладов',
  'Your spread is not ready yet. Are you sure?':
    'Расклад еще не готов. Вы уверены?',
  'Yes': 'Да',
  'No': 'Нет',
  'Interpreting': 'Интерпретация',

  ...CARDS,
};

export default TRANSLATIONS_RU;
