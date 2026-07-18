import type { Theme } from '../model/types/questions';

import { SpreadType } from '@/entities/Spread';

const QUESTION_LIBRARY: Theme[] = [
  {
    name: 'Anxiety and uncertainty',
    questions: [
      {
        label: 'General anxiety about the future',
        text: 'What awaits me in the coming months? Possible scenarios.',
        spreadTitle: 'Life horizon',
        spreadNumber: 7,
        spreadId: SpreadType.HORSESHOE,
      },
      {
        label: 'Fear of the unknown',
        text: 'What risks and opportunities lie ahead? How to prepare.',
        spreadTitle: 'The fog is clearing',
        spreadNumber: 5,
        spreadId: SpreadType.FIVE,
      },
      {
        label: 'Uncertainty in life',
        text: 'Why is everything unstable? What stabilizes the situation?',
        spreadTitle: 'Support in chaos',
        spreadNumber: 5,
        spreadId: SpreadType.FIVE,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Decision Making',
    questions: [
      {
        label: 'Choosing between options',
        text: 'Which path to choose? Pros and cons of each.',
        spreadTitle: 'Three roads',
        spreadNumber: 9,
        areDetailsNeeded: true,
        detailsQuestion: 'What are your options?',
        detailsAnswer: 'Your options',
        spreadId: SpreadType.NINE,
      },
      {
        label: 'Fear of making a mistake in decision',
        text: 'Is this the right move? Support from the Universe.',
        spreadTitle: 'Sign of fate',
        spreadNumber: 4,
        areDetailsNeeded: true,
        detailsQuestion: 'What is the decision about?',
        detailsAnswer: 'The decision',
        spreadId: SpreadType.FOUR,
      },
      {
        label: 'Passing the buck',
        text: 'What do the cards advise to do in this situation?',
        spreadTitle: 'Advice of the sage',
        spreadNumber: 3,
        areDetailsNeeded: true,
        detailsQuestion: 'What is the situation?',
        detailsAnswer: 'The situation',
        spreadId: SpreadType.THREE,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Relationships and love',
    questions: [
      {
        label: 'Love and relationships now',
        text: 'What dynamic is unfolding between us? What deserves attention now?',
        spreadTitle: 'Relationship triangle',
        spreadNumber: 3,
        spreadId: SpreadType.THREE,
      },
      {
        label: "The couple's future",
        text: 'Where can the relationship move if the current dynamic continues? What can influence it?',
        spreadTitle: 'The path of love',
        spreadNumber: 7,
        spreadId: SpreadType.HORSESHOE,
      },
      {
        label: 'Returning to an ex',
        text: 'What draws me back? What would returning require, and what risks should I consider?',
        spreadTitle: 'Bridge back',
        spreadNumber: 5,
        areDetailsNeeded: true,
        detailsQuestion: 'What makes you consider returning?',
        detailsAnswer: 'What makes me consider returning',
        spreadId: SpreadType.FIVE,
      },
      {
        label: 'Dating a new person',
        text: 'What dynamic is forming? What should I notice before investing further?',
        spreadTitle: 'Chemistry at the start',
        spreadNumber: 4,
        spreadId: SpreadType.FOUR,
      },
      {
        label: 'Scenarios in love',
        text: 'Why do mistakes repeat themselves? How to break the cycle.',
        spreadTitle: 'Karmic love',
        spreadNumber: 5,
        areDetailsNeeded: true,
        detailsQuestion: 'What are the mistakes you want to fix?',
        detailsAnswer: 'Mistakes I want to fix',
        spreadId: SpreadType.FIVE,
      },
      {
        label: 'Compatibility',
        text: 'How do our needs and values interact? Where are the strengths and points of friction?',
        spreadTitle: 'Two decks',
        spreadNumber: 6,
        spreadId: SpreadType.TWO_DECKS,
      },
      {
        label: 'Breakup',
        text: 'What should I understand before ending or continuing this relationship? How can I care for myself?',
        spreadTitle: 'The door is closed',
        spreadNumber: 6,
        spreadId: SpreadType.SIX,
      },
      {
        label: 'Readiness for a new relationship',
        text: 'What may be preventing a new connection? What can help me become more open to it?',
        spreadTitle: 'Star of love',
        spreadNumber: 7,
        spreadId: SpreadType.SEVEN,
      },
      {
        label: 'Trust and uncertainty',
        text: 'What is fueling my mistrust? What needs clarification, honesty or firmer boundaries?',
        spreadTitle: 'Mystery revealed',
        spreadNumber: 6,
        areDetailsNeeded: true,
        detailsQuestion: 'What has made you question trust in this relationship?',
        detailsAnswer: 'What has made me question trust',
        spreadId: SpreadType.SIX,
      },
      {
        label: 'Crisis in a couple',
        text: 'What is straining the relationship? What can be restored, and what may require acceptance?',
        spreadTitle: 'Storm in a relationship',
        spreadNumber: 10,
        spreadId: SpreadType.CELTIC_CROSS,
      },
      {
        label: 'Self-esteem in love',
        text: 'Why do I choose the "wrong ones"? How to love yourself.',
        spreadTitle: 'Mirror of the Soul',
        spreadNumber: 10,
        areDetailsNeeded: true,
        detailsQuestion: 'Why do you think you choose the "wrong ones"?',
        detailsAnswer: 'I choose the "wrong ones because',
        spreadId: SpreadType.CELTIC_CROSS,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Work, career, self-realization',
    questions: [
      {
        label: 'Change of profession',
        text: 'Where to go? Is this "my" job?',
        spreadTitle: 'Career turnaround',
        spreadNumber: 7,
        areDetailsNeeded: true,
        detailsQuestion: 'What is your current profession?',
        detailsAnswer: 'My current profession',
        spreadId: SpreadType.HORSESHOE,
      },
      {
        label: 'Finding your "thing"',
        text: 'What are my talents? Where can I find fulfillment?',
        spreadTitle: 'Call of Destiny',
        spreadNumber: 6,
        spreadId: SpreadType.SIX,
      },
      {
        label: 'Doubts about offers',
        text: 'Which offer to choose? The risks of each.',
        spreadTitle: 'Two jobs',
        spreadNumber: 5,
        areDetailsNeeded: true,
        detailsQuestion: 'What are the offers you are considering?',
        detailsAnswer: 'The offers I am considering are',
        spreadId: SpreadType.FIVE,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Money and business',
    questions: [
      {
        label: 'Launching a project/business',
        text: "What's hindering growth? Strategy adjustments.",
        spreadTitle: 'Business Impulse',
        spreadNumber: 7,
        areDetailsNeeded: true,
        detailsQuestion: 'What is your current business?',
        detailsAnswer: 'My current business',
        spreadId: SpreadType.SEVEN,
      },
      {
        label: 'Blind spots in the project',
        text: 'Obstacles, resources, growth points.',
        spreadTitle: 'Business diagnosis',
        spreadNumber: 10,
        spreadId: SpreadType.CELTIC_CROSS,
      },
      {
        label: 'Risk assessment',
        text: 'Investment/Partnership Risks? Summary.',
        spreadTitle: 'Weighing the odds',
        spreadNumber: 5,
        spreadId: SpreadType.FIVE,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Self-knowledge and crises',
    questions: [
      {
        label: 'Stuck on autopilot',
        text: 'What are my true desires? What needs to be changed?',
        spreadTitle: 'Awakening',
        spreadNumber: 6,
        spreadId: SpreadType.SIX,
      },
      {
        label: 'Search for wishes',
        text: 'What do I really want?',
        spreadTitle: 'The heart speaks',
        spreadNumber: 4,
        spreadId: SpreadType.FOUR,
      },
      {
        label: 'Crises of meaning/age',
        text: 'The logic of my story? New meaning.',
        spreadTitle: 'Puzzle of life',
        spreadNumber: 10,
        spreadId: SpreadType.CELTIC_CROSS,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Emotional relief',
    questions: [
      {
        label: 'Speak out through cards',
        text: 'What hurts inside? A gentle analysis.',
        spreadTitle: 'A heart-to-heart talk',
        spreadNumber: 5,
        spreadId: SpreadType.FIVE,
      },
      {
        label: 'Name feelings',
        text: 'What do I feel? How to experience',
        spreadTitle: 'Emotions in the open',
        spreadNumber: 3,
        spreadId: SpreadType.THREE,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Spirituality and the Path',
    questions: [
      {
        label: 'Connection to the Greater',
        text: 'My path, signs of the Universe.',
        spreadTitle: 'Spiritual compass',
        spreadNumber: 5,
        spreadId: SpreadType.FIVE,
      },
      {
        label: 'Meanings of events',
        text: 'Why did this happen to me?',
        spreadTitle: 'Lesson of fate',
        spreadNumber: 6,
        spreadId: SpreadType.SIX,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Rituals of transformation',
    questions: [
      {
        label: 'New stage of life',
        text: 'Support at the start: moving, year, relationships.',
        spreadTitle: 'New moon',
        spreadNumber: 7,
        spreadId: SpreadType.HORSESHOE,
      },
      {
        label: 'Completing the cycle',
        text: 'What to let go of? What to take into the new.',
        spreadTitle: 'Liberation',
        spreadNumber: 4,
        spreadId: SpreadType.FOUR,
      },
    ],
    isTemplate: true,
  },
  {
    name: 'Intuition vs. rationality',
    questions: [
      {
        label: 'Intuitive advice',
        text: 'What does your gut tell you? Symbols.',
        spreadTitle: 'The voice of intuition',
        spreadNumber: 3,
        spreadId: SpreadType.THREE,
      },
      {
        label: 'Figurative language',
        text: 'Metaphors for my questions.',
        spreadTitle: 'Tale of cards',
        spreadNumber: 5,
        spreadId: SpreadType.FIVE,
      },
    ],
    isTemplate: true,
  },
];

const getThemeQuestions = (name: string) =>
  QUESTION_LIBRARY.find((theme) => theme.name === name)?.questions ?? [];

const anxietyQuestions = getThemeQuestions('Anxiety and uncertainty');
const relationshipQuestions = getThemeQuestions('Relationships and love');

const ADDITIONAL_QUESTIONS: Record<string, Theme['questions']> = {
  decisions: [
    {
      label: 'Consequences of inaction',
      text: 'How may the situation develop if I leave it unchanged?',
      spreadTitle: 'Still water',
      spreadNumber: 7,
      spreadId: SpreadType.HORSESHOE,
      areDetailsNeeded: true,
      detailsQuestion: 'What situation are you considering?',
      detailsAnswer: 'The situation I am considering',
    },
    {
      label: 'Preparing for an important conversation',
      text: 'What should I understand before the conversation? What tone and boundaries will help?',
      spreadTitle: 'Before the conversation',
      spreadNumber: 5,
      spreadId: SpreadType.FIVE,
      areDetailsNeeded: true,
      detailsQuestion: 'What conversation are you preparing for?',
      detailsAnswer: 'The conversation I am preparing for',
    },
  ],
  innerState: [
    {
      label: 'Sources of exhaustion',
      text: 'What is draining my energy now? What can help me recover?',
      spreadTitle: 'Return of strength',
      spreadNumber: 5,
      spreadId: SpreadType.FIVE,
    },
    {
      label: 'Circle of control',
      text: 'What is within my control, and what is better to release?',
      spreadTitle: 'My area of influence',
      spreadNumber: 4,
      spreadId: SpreadType.FOUR,
      areDetailsNeeded: true,
      detailsQuestion: 'What situation feels difficult to control?',
      detailsAnswer: 'The situation that feels difficult to control',
    },
  ],
  spiritualPath: [
    {
      label: 'Lesson of the current period',
      text: 'What inner quality is this stage inviting me to develop?',
      spreadTitle: 'Path through the stage',
      spreadNumber: 7,
      spreadId: SpreadType.HORSESHOE,
    },
    {
      label: 'Grounding intuition',
      text: 'How can I distinguish an intuitive signal from anxiety or wishful thinking?',
      spreadTitle: 'Clear signal',
      spreadNumber: 5,
      spreadId: SpreadType.FIVE,
    },
  ],
};

const prioritizeQuestions = (questions: Theme['questions'], labels: string[]) => [
  ...labels.flatMap((label) => questions.filter((question) => question.label === label)),
  ...questions.filter((question) => !labels.includes(question.label)),
];

const enrichQuestions = (questions: Theme['questions'], tags: string[]) =>
  questions.map((question, index) => ({
    ...question,
    depth: question.spreadNumber <= 3
      ? 'quick' as const
      : question.spreadNumber >= 9
      ? 'deep' as const
      : 'balanced' as const,
    featured: index < 4,
    tags,
  }));

export const THEMES: Theme[] = [
  {
    name: 'Decisions and future',
    questions: enrichQuestions([
      ...getThemeQuestions('Decision Making'),
      ...anxietyQuestions.filter(
        (question) => question.label === 'General anxiety about the future',
      ),
      ...ADDITIONAL_QUESTIONS.decisions,
    ], ['decision', 'future', 'uncertainty']),
    isTemplate: true,
  },
  {
    name: 'Love and relationships',
    questions: enrichQuestions(prioritizeQuestions(
      relationshipQuestions.filter(
        (question) => question.label !== 'Self-esteem in love',
      ),
      [
        'Love and relationships now',
        'Crisis in a couple',
        'Scenarios in love',
        'Dating a new person',
      ],
    ), ['love', 'relationship']),
    isTemplate: true,
  },
  {
    name: 'Work and money',
    questions: enrichQuestions([
      ...getThemeQuestions('Work, career, self-realization'),
      ...getThemeQuestions('Money and business'),
    ], ['career', 'money', 'business']),
    isTemplate: true,
  },
  {
    name: 'Inner state',
    questions: enrichQuestions([
      ...anxietyQuestions.filter(
        (question) => question.label !== 'General anxiety about the future',
      ),
      ...getThemeQuestions('Emotional relief'),
      ...ADDITIONAL_QUESTIONS.innerState,
    ], ['emotion', 'anxiety', 'support']),
    isTemplate: true,
  },
  {
    name: 'Self-knowledge and change',
    questions: enrichQuestions([
      ...getThemeQuestions('Self-knowledge and crises'),
      ...getThemeQuestions('Rituals of transformation'),
      ...relationshipQuestions.filter(
        (question) => question.label === 'Self-esteem in love',
      ),
    ], ['self-knowledge', 'change', 'growth']),
    isTemplate: true,
  },
  {
    name: 'Spiritual path',
    questions: enrichQuestions([
      ...getThemeQuestions('Spirituality and the Path'),
      ...getThemeQuestions('Intuition vs. rationality'),
      ...ADDITIONAL_QUESTIONS.spiritualPath,
    ], ['spirituality', 'intuition', 'meaning']),
    isTemplate: true,
  },
];
