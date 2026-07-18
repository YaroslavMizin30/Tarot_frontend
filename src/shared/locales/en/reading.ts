import CARDS from './cards';

import { TARIFFS } from '@/shared/const/tariffs';

const TRANSLATIONS_EN: Record<string, string> = {
  'Topics': 'Topics',
  'Setup': 'Setup',
  'Spread progress': 'Spread progress',
  'Personalization': 'Personalization',
  'of': 'of',
  'Make readings more personal': 'Make readings more personal',
  'Readings are personalized': 'Readings are personalized',
  'You can update your answers anytime': 'You can update your answers anytime',
  'What is taking up most of your thoughts right now?':
    'What is taking up most of your thoughts right now?',
  'Relationships': 'Relationships',
  'Work and growth': 'Work and growth',
  'Money': 'Money',
  'Inner state': 'Inner state',
  'Changes': 'Changes',
  'Finding direction': 'Finding direction',
  'Where do you feel you are now?': 'Where do you feel you are now?',
  'Starting something new': 'Starting something new',
  'Choosing a direction': 'Choosing a direction',
  'Moving toward a goal': 'Moving toward a goal',
  'Going through changes': 'Going through changes',
  'Recovering': 'Recovering',
  'Hard to define yet': 'Hard to define yet',
  'What is most useful to hear in a reading?':
    'What is most useful to hear in a reading?',
  'A clear conclusion': 'A clear conclusion',
  'Possible scenarios': 'Possible scenarios',
  'Hidden reasons': 'Hidden reasons',
  'A practical next step': 'A practical next step',
  'What tone feels right for you?': 'What tone feels right for you?',
  'Gentle and supportive': 'Gentle and supportive',
  'Calm and neutral': 'Calm and neutral',
  'Direct and specific': 'Direct and specific',
  'Is there any context worth keeping in mind?':
    'Is there any context worth keeping in mind?',
  'Choose up to two': 'Choose up to two',
  'For example: I am considering a career change':
    'For example: I am considering a career change',
  'Could not save answers': 'Could not save answers. Please try again.',
  'Continue': 'Continue',
  'Save': 'Save',
  'Choose a card': 'Choose a card',
  'Choose card': 'Choose card',
  'Cards are selected': 'Cards are selected',
  'Your selection is saved': 'Your selection is saved',
  'Selected cards': 'Selected cards',
  'Lay out cards': 'Lay out cards',
  'Focus on your question and choose the card that draws you':
    'Focus on your question and choose the card that draws you',
  'Select the rest automatically': 'Select the rest automatically',
  'Get interpretation': 'Get interpretation',
  'Unable to select card': 'Unable to select the card. Try again.',

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
  'Show all questions': 'Show all questions',
  'All questions': 'All questions',
  'Back': 'Back',
  'What would you like to ask?': 'What would you like to ask?',
  'Your question': 'Your question',
  'Choose spread': 'Choose a spread',
  'Recommended': 'Recommended',
  'Go to cards': 'Go to cards',
  'cards': 'cards',
  'Recommended for this question': 'Recommended for this question',
  'Checking balance': 'Checking balance',
  'Unable to prepare spread': 'Unable to prepare the spread. Try again.',
  'Unable to resume spread': 'Unable to resume the spread. Try again.',
  'This spread is suitable for quick assessment':
    'A concise answer for a quick assessment of the situation.',
  "This simple Tarot spread will help you get answers to any questions you're interested in":
    'Three perspectives for a balanced view of the question.',
  'This spread breaks down the situation into components and analyzes it by parts — its fiery aspect, watery aspect, and so on.':
    'A detailed analysis of the different sides of the situation.',

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

  'Interpretation': 'Interpretation',
  'Single Card': 'Single card',
  'Three Cards': 'Three cards',
  'Pentagram': 'Pentagram',
  'Need tarot spread interpretation': 'Need tarot spread interpretation',
  'Spread title': 'Spread title',
  'Cards': 'Cards',
  'Do not talk about user as a third person':
    'Do not talk about user as a third person',
  'Your spread is not ready yet. Are you sure?':
    'Your spread is not ready yet. Are you sure?',
  'Yes': 'Yes',
  'No': 'No',
  'Interpreting': 'Interpreting',
  'To spread': 'To spread',
  'Unfold cards one by one': 'Unfold cards one by one',
  'Reveal all cards': 'Reveal all cards',
  'Reveal card': 'Reveal card',
  'Unfold the card': 'Unfold the card',
  'Shuffling the deck': 'Shuffling the deck',

  [`You've reached the daily limit of ${TARIFFS.standard.spreads} spreads for the standard tariff. Upgrade to the extended tariff to get more spreads`]: `You've reached the daily limit of ${TARIFFS.standard.spreads} spreads for the standard tariff. Upgrade to the extended tariff to get more spreads`,
  [`You've reached the daily limit of ${TARIFFS.extended.spreads} spreads for the extended tariff 😔`]: `You've reached the daily limit of ${TARIFFS.extended.spreads} spreads for the extended tariff 😔`,
  "You've reached the daily limit of spreads 😔":
    "You've reached the daily limit of spreads 😔",

  'inverted': 'inverted',
  'upright': 'upright',
  ...CARDS,
};

export default TRANSLATIONS_EN;
