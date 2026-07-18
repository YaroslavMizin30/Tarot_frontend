import CARDS from './cards';

import { TARIFFS } from '@/shared/const/tariffs';

const TRANSLATIONS_RU: Record<string, string> = {
  'Topics': 'Темы раскладов',
  'Setup': 'Настройка',
  'Spread progress': 'Прогресс расклада',
  'Personalization': 'Персонализация',
  'of': 'из',
  'Make readings more personal': 'Сделать расклады точнее',
  'Readings are personalized': 'Расклады настроены',
  'You can update your answers anytime': 'Ответы можно изменить в любой момент',
  'What is taking up most of your thoughts right now?':
    'Что сейчас занимает больше всего ваших мыслей?',
  'Relationships': 'Отношения',
  'Work and growth': 'Работа и развитие',
  'Money': 'Деньги',
  'Changes': 'Перемены',
  'Finding direction': 'Поиск направления',
  'Where do you feel you are now?': 'На каком этапе вы сейчас?',
  'Starting something new': 'Начинаю новое',
  'Choosing a direction': 'Выбираю направление',
  'Moving toward a goal': 'Двигаюсь к цели',
  'Going through changes': 'Переживаю перемены',
  'Recovering': 'Восстанавливаюсь',
  'Hard to define yet': 'Пока сложно определить',
  'What is most useful to hear in a reading?':
    'Что обычно полезнее услышать в раскладе?',
  'A clear conclusion': 'Прямой вывод',
  'Possible scenarios': 'Возможные сценарии',
  'Hidden reasons': 'Скрытые причины',
  'A practical next step': 'Практический следующий шаг',
  'What tone feels right for you?': 'Какой тон вам ближе?',
  'Gentle and supportive': 'Мягкий и поддерживающий',
  'Calm and neutral': 'Спокойный и нейтральный',
  'Direct and specific': 'Прямой и конкретный',
  'Is there any context worth keeping in mind?':
    'Есть ли контекст, который стоит учитывать?',
  'Choose up to two': 'Можно выбрать до двух вариантов',
  'For example: I am considering a career change':
    'Например: рассматриваю смену сферы работы',
  'Could not save answers': 'Не удалось сохранить ответы. Попробуйте ещё раз.',
  'Continue': 'Продолжить',
  'Save': 'Сохранить',
  'Choose a card': 'Выберите карту',
  'Choose card': 'Выбрать карту',
  'Cards are selected': 'Карты выбраны',
  'Your selection is saved': 'Ваш выбор сохранён',
  'Selected cards': 'Выбранные карты',
  'Lay out cards': 'Разложить карты',
  'Focus on your question and choose the card that draws you':
    'Сосредоточьтесь на вопросе и выберите карту, которая вас притягивает',
  'Select the rest automatically': 'Выбрать остальные автоматически',
  'Get interpretation': 'Получить интерпретацию',
  'Unable to select card': 'Не удалось выбрать карту. Попробуйте ещё раз.',

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
  'Show all questions': 'Показать все вопросы',
  'All questions': 'Все вопросы',
  'Back': 'Назад',
  'What would you like to ask?': 'О чём вы хотите спросить?',
  'Your question': 'Ваш вопрос',
  'Choose spread': 'Выберите расклад',
  'Recommended': 'Рекомендуем',
  'Go to cards': 'Перейти к картам',
  'cards': 'карт',
  'Recommended for this question': 'Рекомендуется для этого вопроса',
  'Checking balance': 'Проверяем баланс',
  'Unable to prepare spread': 'Не удалось подготовить расклад. Попробуйте ещё раз.',
  'Unable to resume spread': 'Не удалось восстановить расклад. Попробуйте ещё раз.',
  'This spread is suitable for quick assessment':
    'Краткий ответ для быстрой оценки ситуации.',
  "This simple Tarot spread will help you get answers to any questions you're interested in":
    'Три перспективы для взвешенного взгляда на вопрос.',
  'This spread breaks down the situation into components and analyzes it by parts — its fiery aspect, watery aspect, and so on.':
    'Подробный анализ разных сторон ситуации.',

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
    'Стоит ли возвращаться? Мысли партнёра, итог.',
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
  'Horseshoe': 'Подкова',
  'A deep look at the development of a situation: from the past and hidden influences to advice and a possible outcome.':
    'Глубокий разбор развития ситуации: от прошлого и скрытых влияний до совета и возможного результата.',
  'Past': 'Прошлое',
  'Present': 'Настоящее',
  'Hidden influence': 'Скрытое влияние',
  'Main obstacle': 'Главное препятствие',
  'External circumstances': 'Внешние обстоятельства',
  'Advice': 'Совет',
  'Possible outcome': 'Возможный результат',
  'Decisions and future': 'Решения и будущее',
  'Love and relationships': 'Любовь и отношения',
  'Work and money': 'Работа и деньги',
  'Inner state': 'Внутреннее состояние',
  'Self-knowledge and change': 'Самопознание и перемены',
  'Spiritual path': 'Духовный путь',
  'Consequences of inaction': 'Если ничего не менять',
  'How may the situation develop if I leave it unchanged?':
    'Как может развиваться ситуация, если оставить всё без изменений?',
  'Still water': 'Тихая вода',
  'What situation are you considering?': 'О какой ситуации идёт речь?',
  'The situation I am considering': 'Ситуация, которую я рассматриваю',
  'Preparing for an important conversation': 'Подготовка к важному разговору',
  'What should I understand before the conversation? What tone and boundaries will help?':
    'Что стоит понять перед разговором? Какой тон и какие границы помогут?',
  'Before the conversation': 'Перед разговором',
  'What conversation are you preparing for?': 'К какому разговору вы готовитесь?',
  'The conversation I am preparing for': 'Разговор, к которому я готовлюсь',
  'Sources of exhaustion': 'Источники усталости',
  'What is draining my energy now? What can help me recover?':
    'Что сейчас забирает мои силы? Что поможет восстановиться?',
  'Return of strength': 'Возвращение сил',
  'Circle of control': 'Круг контроля',
  'What is within my control, and what is better to release?':
    'Что находится под моим контролем, а что лучше отпустить?',
  'My area of influence': 'Зона моего влияния',
  'What situation feels difficult to control?': 'Какую ситуацию вам трудно контролировать?',
  'The situation that feels difficult to control': 'Ситуация, которую мне трудно контролировать',
  'Lesson of the current period': 'Урок текущего периода',
  'What inner quality is this stage inviting me to develop?':
    'Какое внутреннее качество предлагает развить этот этап?',
  'Path through the stage': 'Путь через этап',
  'Grounding intuition': 'Интуиция без тревоги',
  'How can I distinguish an intuitive signal from anxiety or wishful thinking?':
    'Как отличить интуитивный сигнал от тревоги или желаемого за действительное?',
  'Clear signal': 'Ясный сигнал',
  'What dynamic is unfolding between us? What deserves attention now?':
    'Какая динамика складывается между нами? Что сейчас требует внимания?',
  'Where can the relationship move if the current dynamic continues? What can influence it?':
    'Куда могут двигаться отношения при нынешней динамике? Что способно на неё повлиять?',
  'What draws me back? What would returning require, and what risks should I consider?':
    'Что тянет меня назад? Чего потребует возвращение и какие риски стоит учесть?',
  'What makes you consider returning?': 'Почему вы думаете о возвращении?',
  'What makes me consider returning': 'Почему я думаю о возвращении',
  'What dynamic is forming? What should I notice before investing further?':
    'Какая динамика формируется? Что стоит заметить, прежде чем вкладываться сильнее?',
  'How do our needs and values interact? Where are the strengths and points of friction?':
    'Как взаимодействуют наши потребности и ценности? В чём сила союза и возможные точки напряжения?',
  'What should I understand before ending or continuing this relationship? How can I care for myself?':
    'Что важно понять перед завершением или продолжением отношений? Как позаботиться о себе?',
  'Readiness for a new relationship': 'Готовность к новым отношениям',
  'What may be preventing a new connection? What can help me become more open to it?':
    'Что может мешать новой близости? Что поможет стать более открытым к ней?',
  'Trust and uncertainty': 'Доверие и неопределённость',
  'What is fueling my mistrust? What needs clarification, honesty or firmer boundaries?':
    'Что подпитывает моё недоверие? Где нужны ясность, честность или более твёрдые границы?',
  'What has made you question trust in this relationship?':
    'Что заставило вас усомниться в доверии в этих отношениях?',
  'What has made me question trust': 'Что заставило меня усомниться в доверии',
  'What is straining the relationship? What can be restored, and what may require acceptance?':
    'Что создаёт напряжение в отношениях? Что можно восстановить, а что потребует принятия?',
  'Celtic Cross': 'Кельтский крест',
  'A detailed spread for a complex situation: its roots, influences, development and possible outcome.':
    'Подробный расклад для сложной ситуации: её причины, влияния, развитие и возможный результат.',
  'Core of the situation': 'Суть ситуации',
  'Challenge': 'Препятствие',
  'Foundation': 'Основание',
  'Possibility': 'Возможность',
  'Near future': 'Ближайшее будущее',
  'Self': 'Вы',
  'Environment': 'Окружение',
  'Hopes and fears': 'Надежды и опасения',
  'Outcome': 'Итог',
  'Need tarot spread interpretation': 'Нужна интерпретация для расклада таро',
  'Spread title': 'Название расклада',
  'Cards': 'Карты',
  'Do not talk about user as a third person':
    'Не указывать в ответе ссылки на самого пользователя в третьем лице',
  'Your spread is not ready yet. Are you sure?':
    'Расклад еще не готов. Вы уверены?',
  'Yes': 'Да',
  'No': 'Нет',
  'Interpreting': 'Интерпретация',
  'To spread': 'К раскладу',
  'Unfold cards one by one': 'Переверните карты по очереди',
  'Reveal all cards': 'Открыть все карты',
  'Reveal card': 'Открыть карту',
  'Unfold the card': 'Переверните карту',
  'Shuffling the deck': 'Тасую колоду',

  [`You've reached the daily limit of ${TARIFFS.standard.spreads} spreads for the standard tariff. Upgrade to the extended tariff to get more spreads`]: `Вы достигли дневного лимита в ${TARIFFS.standard.spreads} раскладов для стандартного тарифа. Перейдите на расширенный тариф, чтобы получить больше раскладов`,
  [`You've reached the daily limit of ${TARIFFS.extended.spreads} spreads for the extended tariff 😔`]: `Вы достигли дневного лимита в ${TARIFFS.extended.spreads} раскладов для расширенного тарифа 😔`,
  "You've reached the daily limit of spreads 😔":
    'Вы достигли дневного лимита раскладов 😔',

  'inverted': 'перевернута',
  'upright': 'в прямом положении',

  ...CARDS,
};

export default TRANSLATIONS_RU;
