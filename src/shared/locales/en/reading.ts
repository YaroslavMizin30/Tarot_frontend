import { CardName } from '@/shared/types/arcana';

const TRANSLATIONS: Record<string, string> = {
  'Topics': 'Topics',

  // Темы
  'Anxiety and uncertainty': 'Anxiety and uncertainty',
  'Decision Making': 'Decision Making',
  'Relationships and love': 'Relationships and love',
  'Work, career, self-realization': 'Work, career, self-realization',
  'Money and business': 'Money and business',
  'Self-knowledge and crises': 'Self-knowledge and crises',
  'Emotional relief': 'Emotional relief',
  'Spirituality and the Path': 'Spirituality and the Path',
  'Rituals of transformation': 'Rituals of transformation',
  'Intuition vs. rationality': 'Intuition vs. rationality',
  'My own question': 'My own question',

  // Вопросы
  'General anxiety about the future': 'General anxiety about the future',
  'Fear of the unknown': 'Fear of the unknown',
  'Uncertainty in life': 'Uncertainty in life',
  'Choosing between options': 'Choosing between options',
  'Fear of making a mistake in decision':
    'Fear of making a mistake in decision',
  'Passing the buck': 'Passing the buck',
  'Love and relationships now': 'Love and relationships now',
  "The couple's future": "The couple's future",
  'Returning to an ex': 'Returning to an ex',
  'Dating a new person': 'Dating a new person',
  'Scenarios in love': 'Scenarios in love',
  'Compatibility': 'Compatibility',
  'Breakup': 'Breakup',
  'Loneliness and "the one"': 'Loneliness and "the one"',
  'Cheating and betrayal"': 'Cheating and betrayal"',
  'Crisis in a couple': 'Crisis in a couple',
  'Self-esteem in love': 'Self-esteem in love',
  'Change of profession': 'Change of profession',
  'Finding your "thing"': 'Finding your "thing"',
  'Doubts about offers': 'Doubts about offers',
  'Launching a project/business': 'Launching a project/business',
  'Blind spots in the project': 'Blind spots in the project',
  'Risk assessment': 'Risk assessment',
  'Stuck on autopilot': 'Stuck on autopilot',
  'Search for wishes': 'Search for wishes',
  'Crises of meaning/age': 'Crises of meaning/age',
  'Speak out through cards': 'Speak out through cards',
  'Name feelings': 'Name feelings',
  'Connection to the Greater': 'Connection to the Greater',
  'Meanings of events': 'Meanings of events',
  'New stage of life': 'New stage of life',
  'Completing the cycle': 'Completing the cycle',
  'Intuitive advice': 'Intuitive advice',
  'Figurative language': 'Figurative language',

  // Тексты
  'What awaits me in the coming months? Possible scenarios.':
    'What awaits me in the coming months? Possible scenarios.',
  'What risks and opportunities lie ahead? How to prepare.':
    'What risks and opportunities lie ahead? How to prepare.',
  'Why is everything unstable? What stabilizes the situation?':
    'Why is everything unstable? What stabilizes the situation?',
  'Which path to choose? Pros and cons of each.':
    'Which path to choose? Pros and cons of each.',
  'Is this the right move? Support from the Universe.':
    'Is this the right move? Support from the Universe.',
  'What do the cards advise to do in this situation?':
    'What do the cards advise to do in this situation?',
  "What's going on between me and my partner? Feelings, motives.":
    "What's going on between me and my partner? Feelings, motives.",
  'Is there a chance for our relationship? What lies ahead.':
    'Is there a chance for our relationship? What lies ahead.',
  "Should I return it? Partner's thoughts, conclusion.":
    "Should I return it? Partner's thoughts, conclusion.",
  'How does he(she) feel? Prospects.': 'How does he(she) feel? Prospects.',
  'Why do mistakes repeat themselves? How to break the cycle.':
    'Why do mistakes repeat themselves? How to break the cycle.',
  'Are we a good fit? Strengths/Weaknesses.':
    'Are we a good fit? Strengths/Weaknesses.',
  'Am I leaving correctly? How to let go.':
    'Am I leaving correctly? How to let go.',
  "When will I meet my partner? What's blocking me?":
    "When will I meet my partner? What's blocking me?",
  'Is there a third party? What to do.': 'Is there a third party? What to do.',
  'What destroys? How to restore.': 'What destroys? How to restore.',
  'Why do I choose the "wrong ones"? How to love yourself.':
    'Why do I choose the "wrong ones"? How to love yourself.',
  'Where to go? Is this "my" job?': 'Where to go? Is this "my" job?',
  'What are my talents? Where can I find fulfillment?':
    'What are my talents? Where can I find fulfillment?',
  'Which offer to choose? The risks of each.':
    'Which offer to choose? The risks of each.',
  "What's hindering growth? Strategy adjustments.":
    "What's hindering growth? Strategy adjustments.",
  'Obstacles, resources, growth points.':
    'Obstacles, resources, growth points.',
  'Investment/Partnership Risks? Summary.':
    'Investment/Partnership Risks? Summary.',
  'What are my true desires? What needs to be changed?':
    'What are my true desires? What needs to be changed?',
  'What do I really want?': 'What do I really want?',
  'The logic of my story? New meaning.': 'The logic of my story? New meaning.',
  'What hurts inside? A gentle analysis.':
    'What hurts inside? A gentle analysis.',
  'What do I feel? How to experience': 'What do I feel? How to experience',
  'My path, signs of the Universe.': 'My path, signs of the Universe.',
  'Why did this happen to me?': 'Why did this happen to me?',
  'Support at the start: moving, year, relationships.':
    'Support at the start: moving, year, relationships.',
  'What to let go of? What to take into the new.':
    'What to let go of? What to take into the new.',
  'What does your gut tell you? Symbols.':
    'What does your gut tell you? Symbols.',
  'Metaphors for my questions.': 'Metaphors for my questions.',

  // Названия раскладов
  'Life horizon': 'Life horizon',
  'The fog is clearing': 'The fog is clearing',
  'Support in chaos': 'Support in chaos',
  'Three roads': 'Three roads',
  'Sign of fate': 'Sign of fate',
  'Advice of the sage': 'Advice of the sage',
  'Relationship triangle': 'Relationship triangle',
  'The path of love': 'The path of love',
  'Bridge back': 'Bridge back',
  'Chemistry at the start': 'Chemistry at the start',
  'Karmic love': 'Karmic love',
  'Two decks': 'Two decks',
  'The door is closed': 'The door is closed',
  'Star of love': 'Star of love',
  'Mystery revealed': 'Mystery revealed',
  'Storm in a relationship': 'Storm in a relationship',
  'Mirror of the Soul': 'Mirror of the Soul',
  'Career turnaround': 'Career turnaround',
  'Call of Destiny': 'Call of Destiny',
  'Two jobs': 'Two jobs',
  'Business Impulse': 'Business Impulse',
  'Business diagnosis': 'Business diagnosis',
  'Weighing the odds': 'Weighing the odds',
  'Awakening': 'Awakening',
  'The heart speaks': 'The heart speaks',
  'Puzzle of life': 'Puzzle of life',
  'A heart-to-heart talk': 'A heart-to-heart talk',
  'Emotions in the open': 'Emotions in the open',
  'Spiritual compass': 'Spiritual compass',
  'Lesson of fate': 'Lesson of fate',
  'New moon': 'New moon',
  'Liberation': 'Liberation',
  'The voice of intuition': 'The voice of intuition',
  'Tale of cards': 'Tale of cards',

  // Детали вопросов
  'What are your options?': 'What are your options?',
  'Your options': 'Your options',
  'What is the decision about?': 'What is the decision about?',
  'The decision': 'The decision',
  'What is the situation?': 'What is the situation?',
  'The situation': 'The situation',
  'What are the mistakes you want to fix?':
    'What are the mistakes you want to fix?',
  'Mistakes I want to fix': 'Mistakes I want to fix',
  'Why do you think you choose the "wrong ones"?':
    'Why do you think you choose the "wrong ones"?',
  'I choose the "wrong ones because': 'I choose the "wrong ones because',
  'What is your current profession?': 'What is your current profession?',
  'My current profession': 'My current profession',
  'What are the offers you are considering?':
    'What are the offers you are considering?',
  'The offers I am considering are': 'The offers I am considering are',
  'What is your current business?': 'What is your current business?',
  'My current business': 'My current business',
  'Details are required': 'Details are required',

  'Type here...': 'Type here...',

  'Question': 'Question',
  'Spread': 'Spread',
  'Select spread': 'Select spread',
  'Ready?': 'Ready?',
  'Click': 'Click',

  'cards(nominative)': 'cards',
  'cards(accusative)': 'cards',
  'card': 'card',

  // Major Arcana
  [CardName.THE_FOOL]: 'The Fool',
  [CardName.THE_MAGICIAN]: 'The Magician',
  [CardName.THE_HIGH_PRIESTESS]: 'The High Priestess',
  [CardName.THE_EMPRESS]: 'The Empress',
  [CardName.THE_EMPEROR]: 'The Emperor',
  [CardName.THE_HIEROPHANT]: 'The Hierophant',
  [CardName.THE_LOVERS]: 'The Lovers',
  [CardName.THE_CHARIOT]: 'The Chariot',
  [CardName.STRENGTH]: 'Strength',
  [CardName.THE_HERMIT]: 'The Hermit',
  [CardName.WHEEL_OF_FORTUNE]: 'Wheel of Fortune',
  [CardName.JUSTICE]: 'Justice',
  [CardName.THE_HANGED_MAN]: 'The Hanged Man',
  [CardName.DEATH]: 'Death',
  [CardName.TEMPERANCE]: 'Temperance',
  [CardName.THE_DEVIL]: 'The Devil',
  [CardName.THE_TOWER]: 'The Tower',
  [CardName.THE_STAR]: 'The Star',
  [CardName.THE_MOON]: 'The Moon',
  [CardName.THE_SUN]: 'The Sun',
  [CardName.JUDGEMENT]: 'Judgement',
  [CardName.THE_WORLD]: 'The World',

  // Wands
  [CardName.ACE_OF_WANDS]: 'Ace of Wands',
  [CardName.TWO_OF_WANDS]: 'Two of Wands',
  [CardName.THREE_OF_WANDS]: 'Three of Wands',
  [CardName.FOUR_OF_WANDS]: 'Four of Wands',
  [CardName.FIVE_OF_WANDS]: 'Five of Wands',
  [CardName.SIX_OF_WANDS]: 'Six of Wands',
  [CardName.SEVEN_OF_WANDS]: 'Seven of Wands',
  [CardName.EIGHT_OF_WANDS]: 'Eight of Wands',
  [CardName.NINE_OF_WANDS]: 'Nine of Wands',
  [CardName.TEN_OF_WANDS]: 'Ten of Wands',
  [CardName.PAGE_OF_WANDS]: 'Page of Wands',
  [CardName.KNIGHT_OF_WANDS]: 'Knight of Wands',
  [CardName.QUEEN_OF_WANDS]: 'Queen of Wands',
  [CardName.KING_OF_WANDS]: 'King of Wands',

  // Cups
  [CardName.ACE_OF_CUPS]: 'Ace of Cups',
  [CardName.TWO_OF_CUPS]: 'Two of Cups',
  [CardName.THREE_OF_CUPS]: 'Three of Cups',
  [CardName.FOUR_OF_CUPS]: 'Four of Cups',
  [CardName.FIVE_OF_CUPS]: 'Five of Cups',
  [CardName.SIX_OF_CUPS]: 'Six of Cups',
  [CardName.SEVEN_OF_CUPS]: 'Seven of Cups',
  [CardName.EIGHT_OF_CUPS]: 'Eight of Cups',
  [CardName.NINE_OF_CUPS]: 'Nine of Cups',
  [CardName.TEN_OF_CUPS]: 'Ten of Cups',
  [CardName.PAGE_OF_CUPS]: 'Page of Cups',
  [CardName.KNIGHT_OF_CUPS]: 'Knight of Cups',
  [CardName.QUEEN_OF_CUPS]: 'Queen of Cups',
  [CardName.KING_OF_CUPS]: 'King of Cups',

  // Swords
  [CardName.ACE_OF_SWORDS]: 'Ace of Swords',
  [CardName.TWO_OF_SWORDS]: 'Two of Swords',
  [CardName.THREE_OF_SWORDS]: 'Three of Swords',
  [CardName.FOUR_OF_SWORDS]: 'Four of Swords',
  [CardName.FIVE_OF_SWORDS]: 'Five of Swords',
  [CardName.SIX_OF_SWORDS]: 'Six of Swords',
  [CardName.SEVEN_OF_SWORDS]: 'Seven of Swords',
  [CardName.EIGHT_OF_SWORDS]: 'Eight of Swords',
  [CardName.NINE_OF_SWORDS]: 'Nine of Swords',
  [CardName.TEN_OF_SWORDS]: 'Ten of Swords',
  [CardName.PAGE_OF_SWORDS]: 'Page of Swords',
  [CardName.KNIGHT_OF_SWORDS]: 'Knight of Swords',
  [CardName.QUEEN_OF_SWORDS]: 'Queen of Swords',
  [CardName.KING_OF_SWORDS]: 'King of Swords',

  // Pentacles
  [CardName.ACE_OF_COINS]: 'Ace of Pentacles',
  [CardName.TWO_OF_COINS]: 'Two of Pentacles',
  [CardName.THREE_OF_COINS]: 'Three of Pentacles',
  [CardName.FOUR_OF_COINS]: 'Four of Pentacles',
  [CardName.FIVE_OF_COINS]: 'Five of Pentacles',
  [CardName.SIX_OF_COINS]: 'Six of Pentacles',
  [CardName.SEVEN_OF_COINS]: 'Seven of Pentacles',
  [CardName.EIGHT_OF_COINS]: 'Eight of Pentacles',
  [CardName.NINE_OF_COINS]: 'Nine of Pentacles',
  [CardName.TEN_OF_COINS]: 'Ten of Pentacles',
  [CardName.PAGE_OF_COINS]: 'Page of Pentacles',
  [CardName.KNIGHT_OF_COINS]: 'Knight of Pentacles',
  [CardName.QUEEN_OF_COINS]: 'Queen of Pentacles',
  [CardName.KING_OF_COINS]: 'King of Pentacles',
};

export default TRANSLATIONS;
