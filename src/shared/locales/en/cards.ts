import { CardName } from '@/entities/TarotCard';

const TRANSLATIONS_EN = {
  // Names of cards
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

  // ============== Card descriptions ==============
  // Major Arcana
  [`card.${CardName.THE_FOOL}.meanings`]:
    'beginning of a journey, risk, potential, naivety',
  [`card.${CardName.THE_FOOL}.description`]:
    'The Fool is intended for new beginnings, expanding horizons and using the chance suggested by intuition. This card also indicates naivety and excitement about the unknown.',
  [`card.${CardName.THE_MAGICIAN}.meanings`]:
    'manifestation, healing, spirituality, connection with the divine',
  [`card.${CardName.THE_MAGICIAN}.description`]:
    'The Magician represents the ability to understand and control invisible forces of the Universe. In a spread, this card indicates a special gift of a person that has not yet been used.',
  [`card.${CardName.THE_HIGH_PRIESTESS}.meanings`]:
    'divine feminine principle, human wisdom, study of nature, spiritual mystery, inner world',
  [`card.${CardName.THE_HIGH_PRIESTESS}.description`]:
    'The High Priestess symbolizes the feminine spiritual principle, endows with it, and in case of loss of such energy, absorbs it back into herself.',
  [`card.${CardName.THE_EMPRESS}.meanings`]:
    'nature, great mother, fertility',
  [`card.${CardName.THE_EMPRESS}.description`]:
    'The Empress, in contrast to the divinity of the High Priestess, represents the natural feminine principle, symbol of the mother of all.',
  [`card.${CardName.THE_EMPEROR}.meanings`]:
    'leadership, influence, stability, potential for mastery',
  [`card.${CardName.THE_EMPEROR}.description`]:
    'If the Empress is the figure of mother, then the Emperor is father. He symbolizes primacy, strength and power in nature, and must be reckoned with.',
  [`card.${CardName.THE_HIEROPHANT}.meanings`]:
    'practical lessons related to natural law, learning, mastering chosen field of knowledge',
  [`card.${CardName.THE_HIEROPHANT}.description`]:
    'The Hierophant is as powerful as the Emperor, but tends to draw strength not from nature, but from the spiritual. Sometimes indicates the desire to break free from limitations to follow the divine path.',
  [`card.${CardName.THE_LOVERS}.meanings`]:
    'difficult decisions, changes in relationships, compromise',
  [`card.${CardName.THE_LOVERS}.description`]:
    'The Lovers speak of deep intimacy, reminding that relationships give a person value.',
  [`card.${CardName.THE_CHARIOT}.meanings`]:
    'controlling opposing forces, resolving conflict, willpower, journey',
  [`card.${CardName.THE_CHARIOT}.description`]:
    'The Chariot represents control over internal contradictions. It may also indicate the possibility of travel.',
  [`card.${CardName.STRENGTH}.meanings`]:
    'need for discipline, clarifying personal interests to achieve harmony with inner self',
  [`card.${CardName.STRENGTH}.description`]:
    'Strength is depicted as a woman gently controlling a powerful lion. The card means inner strength, overcoming weaknesses, courage and perseverance. In some interpretations, it is also viewed as a symbol of fighting animal nature or harmony with instincts.',
  [`card.${CardName.THE_HERMIT}.meanings`]:
    'self-analysis, contemplation, inner reflection, benefit of time spent alone',
  [`card.${CardName.THE_HERMIT}.description`]:
    'The Hermit is turning inward, reflecting, often in solitude. The card is associated with inner wisdom, self-assessment, often calls for self-analysis. Moreover, The Hermit in a spread may hint that there is a guide nearby offering help.',
  [`card.${CardName.WHEEL_OF_FORTUNE}.meanings`]:
    'inevitable and often positive transformations, cycles of life, beginning and end',
  [`card.${CardName.WHEEL_OF_FORTUNE}.description`]:
    'Wheel of Fortune symbolizes the inevitability of change, starting and ending points. Also indicates crossroads of fate when choosing breaks patterns.',
  [`card.${CardName.JUSTICE}.meanings`]:
    'justice, moral sensitivity, karma, attention to detail',
  [`card.${CardName.JUSTICE}.description`]:
    'Justice is truth, balance and objectivity. Emotional equilibrium follows correct choice, even if it is difficult.',
  [`card.${CardName.THE_HANGED_MAN}.meanings`]:
    'consequences, stagnation, situation that needs to be endured',
  [`card.${CardName.THE_HANGED_MAN}.description`]:
    'The Hanged Man symbolizes sacrifice and the need to look at things from a different perspective. In a spread, it may call for surrender or abandoning patterned actions.',
  [`card.${CardName.DEATH}.meanings`]:
    'ending, moving forward, personal liberation',
  [`card.${CardName.DEATH}.description`]:
    'Death looks ominous, but does not prophesy actual death of a person. This is a card of change that mostly occurs during personal growth when we free ourselves from old behavioral patterns. Death indicates necessary reset to continue the journey.',
  [`card.${CardName.TEMPERANCE}.meanings`]:
    'balance, self-development',
  [`card.${CardName.TEMPERANCE}.description`]:
    'Temperance means self-improvement and avoiding extremes. It appears in a spread when a person is not in harmony with himself. The main meaning of the card is to suggest restoring balance.',
  [`card.${CardName.THE_DEVIL}.meanings`]:
    'trap, unhealthy relationships, material pleasures',
  [`card.${CardName.THE_DEVIL}.description`]:
    "The Devil speaks of inner demons. This card often appears when unhealthy behavioral patterns are activated, whether it's failed relationships, negative self-talk, or addictions.",
  [`card.${CardName.THE_TOWER}.meanings`]:
    'possible or real danger, unexpected upheaval',
  [`card.${CardName.THE_TOWER}.description`]:
    'The Tower is one of the most ominous cards, as it usually foretells serious changes, destruction and even threats. It symbolizes chaos, as well as approaching a dramatic end.',
  [`card.${CardName.THE_STAR}.meanings`]:
    'spirituality, purpose, connection with the divine, excellence, inspiration',
  [`card.${CardName.THE_STAR}.description`]:
    'The Star carries a deep and powerful message, especially for those experiencing rebirth. After stress or destruction, it asks to spend time on self-analysis and heal wounds.',
  [`card.${CardName.THE_MOON}.meanings`]:
    'illusion, impressionability, deception, confusion, discord',
  [`card.${CardName.THE_MOON}.description`]:
    'The Moon speaks of a good time for deep work with the subconscious, of readiness to see and accept the real self. The card calls to free emotions from control to reach the most precious inside oneself.',
  [`card.${CardName.THE_SUN}.meanings`]:
    'vitality, joy, luck, confidence, authenticity',
  [`card.${CardName.THE_SUN}.description`]:
    'The Sun is one of the most positive cards. It symbolizes happiness, success, pleasure, self-expression and life force.',
  [`card.${CardName.JUDGEMENT}.meanings`]:
    'resurrection, awakening, necessity of making decisions',
  [`card.${CardName.JUDGEMENT}.description`]:
    'Judgement refers to Christianity: on Judgment Day God will reveal the righteous and sinners, reward or punish. This card awakens to make corrections in life.',
  [`card.${CardName.THE_WORLD}.meanings`]:
    'end of cycle, significant change, self-realization',
  [`card.${CardName.THE_WORLD}.description`]:
    'The World is a big step forward, a card of absorbing lessons and wisdom. It indicates new understanding of life and role in it, speaks of personal growth and brings satisfaction.',

  // Wands
  [`card.${CardName.ACE_OF_WANDS}.meanings`]:
    'inspiration, new venture, spark of creativity, energy',
  [`card.${CardName.ACE_OF_WANDS}.description`]:
    'Ace of Wands is the seed of creative power, a flash of inspiration that demands action. It signals the beginning of an energetic endeavour, courage to start, and the inner fire needed to bring an idea to life.',
  [`card.${CardName.TWO_OF_WANDS}.meanings`]:
    'planning, decisions, future vision, personal power',
  [`card.${CardName.TWO_OF_WANDS}.description`]:
    'Two of Wands indicates that a person holds the world in their hands and makes deliberate choices about the future. It speaks of strategic planning, leaving the comfort zone, and considering the path forward with confidence.',
  [`card.${CardName.THREE_OF_WANDS}.meanings`]:
    'expansion, foresight, overseas opportunities, progress',
  [`card.${CardName.THREE_OF_WANDS}.description`]:
    'Three of Wands is the card of a merchant looking out over the sea, waiting for ships to return. It represents expansion of horizons, long-term investments paying off, and the fruits of well-thought-out plans.',
  [`card.${CardName.FOUR_OF_WANDS}.meanings`]:
    'celebration, harmony, homecoming, community',
  [`card.${CardName.FOUR_OF_WANDS}.description`]:
    'Four of Wands symbolizes a joyful celebration, a warm homecoming, and harmony with close ones. It indicates a stable foundation, a happy family or community, and milestones worth celebrating together.',
  [`card.${CardName.FIVE_OF_WANDS}.meanings`]:
    'competition, conflict, tension, rivalry',
  [`card.${CardName.FIVE_OF_WANDS}.description`]:
    'Five of Wands depicts a struggle between several opponents, all trying to occupy the same place. It speaks of petty conflicts, competition, and disagreements that are exhausting but rarely bring real harm.',
  [`card.${CardName.SIX_OF_WANDS}.meanings`]:
    'victory, recognition, success, public acclaim',
  [`card.${CardName.SIX_OF_WANDS}.description`]:
    'Six of Wands is the card of triumph and recognition. It points to a well-deserved victory, public acknowledgment, and confidence that comes from having overcome challenges and proven oneself.',
  [`card.${CardName.SEVEN_OF_WANDS}.meanings`]:
    'defence, perseverance, standing your ground, challenges',
  [`card.${CardName.SEVEN_OF_WANDS}.description`]:
    'Seven of Wands shows a person defending a higher position from attackers below. It speaks of the need to hold one’s ground, maintain convictions, and keep fighting despite outside pressure.',
  [`card.${CardName.EIGHT_OF_WANDS}.meanings`]:
    'swift action, movement, quick decisions, momentum',
  [`card.${CardName.EIGHT_OF_WANDS}.description`]:
    'Eight of Wands represents rapid movement, swift progress, and events unfolding at great speed. It often speaks of travel, messages, and a momentum that is hard to stop — the moment to act is now.',
  [`card.${CardName.NINE_OF_WANDS}.meanings`]:
    'resilience, last stand, persistence, caution',
  [`card.${CardName.NINE_OF_WANDS}.description`]:
    'Nine of Wands depicts a wounded but still standing warrior, ready for one more fight. It speaks of resilience, lessons learned through hardship, and the wisdom of conserving energy while remaining vigilant.',
  [`card.${CardName.TEN_OF_WANDS}.meanings`]:
    'burden, responsibility, hard work, completion',
  [`card.${CardName.TEN_OF_WANDS}.description`]:
    'Ten of Wands shows a man carrying an excessive load of sticks towards a city. It speaks of taking on too much, the weight of responsibility, and the importance of knowing when to set down the burden and ask for help.',
  [`card.${CardName.PAGE_OF_WANDS}.meanings`]:
    'enthusiasm, exploration, discovery, free spirit',
  [`card.${CardName.PAGE_OF_WANDS}.description`]:
    'Page of Wands is a young explorer full of enthusiasm and curiosity. The card signals news, an inspiring idea, or the beginning of an adventure. It is a call to follow one’s enthusiasm and explore the unknown.',
  [`card.${CardName.KNIGHT_OF_WANDS}.meanings`]:
    'energy, passion, action, impulsiveness',
  [`card.${CardName.KNIGHT_OF_WANDS}.description`]:
    'Knight of Wands charges forward like a fiery horseman, full of courage, passion, and the desire for change. The card represents bold action, daring initiative, and at times — haste that should be tempered with forethought.',
  [`card.${CardName.QUEEN_OF_WANDS}.meanings`]:
    'confidence, independence, determination, warmth',
  [`card.${CardName.QUEEN_OF_WANDS}.description`]:
    'Queen of Wands embodies self-confidence, charisma, and warm determination. She is a leader who knows her worth, easily inspires others, and creates a life around her on her own terms.',
  [`card.${CardName.KING_OF_WANDS}.meanings`]:
    'leadership, vision, mastery, authority',
  [`card.${CardName.KING_OF_WANDS}.description`]:
    'King of Wands is a mature leader who combines vision with the energy to bring it to life. He speaks of mastery, authority, honesty, and the ability to inspire others through personal example.',

  // Cups
  [`card.${CardName.ACE_OF_CUPS}.meanings`]:
    'new feelings, love, emotional beginning, intuition',
  [`card.${CardName.ACE_OF_CUPS}.description`]:
    'Ace of Cups is a chalice overflowing with pure emotion. It signals the beginning of a deep feeling, new love, spiritual awakening, or emotional fulfilment that nourishes the soul.',
  [`card.${CardName.TWO_OF_CUPS}.meanings`]:
    'partnership, mutual attraction, union, harmony',
  [`card.${CardName.TWO_OF_CUPS}.description`]:
    'Two of Cups depicts two people exchanging cups in a gesture of mutual recognition. It speaks of partnership, harmonious relationships, emotional balance, and the meeting of two hearts.',
  [`card.${CardName.THREE_OF_CUPS}.meanings`]:
    'friendship, celebration, community, joy',
  [`card.${CardName.THREE_OF_CUPS}.description`]:
    'Three of Cups is a card of joyful friendship and shared celebration. It speaks of close friends, parties, support, and the joy that comes from being accepted and surrounded by one’s tribe.',
  [`card.${CardName.FOUR_OF_CUPS}.meanings`]:
    'apathy, contemplation, re-evaluation, missed opportunity',
  [`card.${CardName.FOUR_OF_CUPS}.description`]:
    'Four of Cups depicts a person sitting under a tree, lost in thought, while a cup is being offered. It speaks of emotional stagnation, missed opportunities, and the need to look within to find new motivation.',
  [`card.${CardName.FIVE_OF_CUPS}.meanings`]:
    'loss, grief, disappointment, focusing on the negative',
  [`card.${CardName.FIVE_OF_CUPS}.description`]:
    'Five of Cups shows a figure mourning three spilled cups while two stand behind untouched. It speaks of disappointment, grief, and the human tendency to focus on what is lost rather than what remains.',
  [`card.${CardName.SIX_OF_CUPS}.meanings`]:
    'nostalgia, memories, childhood, reunion',
  [`card.${CardName.SIX_OF_CUPS}.description`]:
    'Six of Cups is filled with warm nostalgia, memories of childhood, and meetings with people from the past. It speaks of kindness, innocence, and the wisdom of learning from one’s roots.',
  [`card.${CardName.SEVEN_OF_CUPS}.meanings`]:
    'choices, fantasies, illusions, wishful thinking',
  [`card.${CardName.SEVEN_OF_CUPS}.description`]:
    'Seven of Cups shows a figure surrounded by visions, dreams, and temptations. It speaks of a moment of choice, the danger of illusions, and the need to distinguish between real opportunities and fantasies.',
  [`card.${CardName.EIGHT_OF_CUPS}.meanings`]:
    'leaving behind, search for meaning, transition, inner journey',
  [`card.${CardName.EIGHT_OF_CUPS}.description`]:
    'Eight of Cups depicts a figure walking away from stacked cups into the mountains. It speaks of the conscious decision to leave behind what no longer satisfies, in search of a deeper meaning.',
  [`card.${CardName.NINE_OF_CUPS}.meanings`]:
    'satisfaction, wish fulfilled, contentment, well-being',
  [`card.${CardName.NINE_OF_CUPS}.description`]:
    'Nine of Cups is the card of emotional satisfaction and the fulfilment of wishes. It speaks of abundance, gratitude, harmony with oneself, and a moment when life feels complete.',
  [`card.${CardName.TEN_OF_CUPS}.meanings`]:
    'happiness, family, harmony, lasting love',
  [`card.${CardName.TEN_OF_CUPS}.description`]:
    'Ten of Cups is the card of true family happiness and emotional fulfilment. It speaks of a strong relationship, a loving home, and a sense of belonging that nourishes all members of the family.',
  [`card.${CardName.PAGE_OF_CUPS}.meanings`]:
    'creative message, sensitivity, dreaminess, intuition',
  [`card.${CardName.PAGE_OF_CUPS}.description`]:
    'Page of Cups is a young dreamer who looks at a cup from which a fish peeks out. The card speaks of a creative message, intuition, sensitivity, and the first signs of new feelings.',
  [`card.${CardName.KNIGHT_OF_CUPS}.meanings`]:
    'romance, charm, pursuit of dreams, idealist',
  [`card.${CardName.KNIGHT_OF_CUPS}.description`]:
    'Knight of Cups rides forward offering a cup, the messenger of feelings and romance. The card represents the pursuit of dreams, charm, imagination, and a readiness to follow the call of the heart.',
  [`card.${CardName.QUEEN_OF_CUPS}.meanings`]:
    'compassion, empathy, intuition, emotional wisdom',
  [`card.${CardName.QUEEN_OF_CUPS}.description`]:
    'Queen of Cups is a deeply intuitive and compassionate figure. She speaks of emotional wisdom, the ability to listen, and the gift of sensing the feelings of others, sometimes at the cost of her own boundaries.',
  [`card.${CardName.KING_OF_CUPS}.meanings`]:
    'emotional balance, diplomacy, calm, wisdom of feelings',
  [`card.${CardName.KING_OF_CUPS}.description`]:
    'King of Cups holds the ocean of feelings in calm hands. He speaks of mature emotional intelligence, the ability to stay calm in storms, diplomacy, and a deep understanding of human nature.',

  // Swords
  [`card.${CardName.ACE_OF_SWORDS}.meanings`]:
    'clarity, breakthrough, truth, new idea',
  [`card.${CardName.ACE_OF_SWORDS}.description`]:
    'Ace of Swords is a flash of mental clarity that cuts through confusion. It speaks of truth, a new idea, victory of the mind, and the moment when a difficult situation finally becomes clear.',
  [`card.${CardName.TWO_OF_SWORDS}.meanings`]:
    'difficult choice, stalemate, indecision, balance',
  [`card.${CardName.TWO_OF_SWORDS}.description`]:
    'Two of Swords depicts a blindfolded figure with two crossed swords. It speaks of a difficult choice, a stalemate, and the need for inner balance before making a decision that will affect the future.',
  [`card.${CardName.THREE_OF_SWORDS}.meanings`]:
    'heartbreak, sorrow, painful truth, grief',
  [`card.${CardName.THREE_OF_SWORDS}.description`]:
    'Three of Swords shows a heart pierced by three blades. It is the card of painful truth, heartbreak, and grief, but also of the cleansing that comes when one allows oneself to feel pain.',
  [`card.${CardName.FOUR_OF_SWORDS}.meanings`]:
    'rest, recuperation, contemplation, pause',
  [`card.${CardName.FOUR_OF_SWORDS}.description`]:
    'Four of Swords depicts a figure lying in silence, eyes closed, in a stained-glass window. It speaks of the need for rest, recovery, and reflection before continuing on the path.',
  [`card.${CardName.FIVE_OF_SWORDS}.meanings`]:
    'conflict, defeat, pyrrhic victory, tension',
  [`card.${CardName.FIVE_OF_SWORDS}.description`]:
    'Five of Swords depicts a man collecting swords after a conflict in which he has won but at a cost. It speaks of hollow victories, conflicts that are won but leave a bitter aftertaste.',
  [`card.${CardName.SIX_OF_SWORDS}.meanings`]:
    'transition, moving on, journey, leaving difficulties behind',
  [`card.${CardName.SIX_OF_SWORDS}.description`]:
    'Six of Swords shows people in a boat sailing away from troubled waters. It speaks of leaving the past behind, gradual recovery, and a transition that, though not easy, leads to calmer shores.',
  [`card.${CardName.SEVEN_OF_SWORDS}.meanings`]:
    'deception, strategy, stealth, avoidance',
  [`card.${CardName.SEVEN_OF_SWORDS}.description`]:
    'Seven of Swords depicts a figure quietly taking swords from a camp. It speaks of cunning, avoidance, possible deception, and the need to be alert to those who act behind one’s back.',
  [`card.${CardName.EIGHT_OF_SWORDS}.meanings`]:
    'self-restriction, victimhood, illusion of captivity, fear',
  [`card.${CardName.EIGHT_OF_SWORDS}.description`]:
    'Eight of Swords shows a blindfolded figure surrounded by swords. Although the path is open, the person sees no way out. The card speaks of self-imposed limitations and the fear that holds one back.',
  [`card.${CardName.NINE_OF_SWORDS}.meanings`]:
    'anxiety, worry, nightmares, mental anguish',
  [`card.${CardName.NINE_OF_SWORDS}.description`]:
    'Nine of Swords depicts a figure sitting up in bed at night, head in hands, surrounded by swords. It speaks of anxiety, night thoughts, worries that amplify in the dark, and the need to share one’s burden.',
  [`card.${CardName.TEN_OF_SWORDS}.meanings`]:
    'ending, rock bottom, completion, painful finale',
  [`card.${CardName.TEN_OF_SWORDS}.description`]:
    'Ten of Swords shows a figure lying face down with ten swords in their back. It is the card of the final fall, the end of a difficult cycle, but also the point after which the only way is up — a new dawn is coming.',
  [`card.${CardName.PAGE_OF_SWORDS}.meanings`]:
    'curiosity, learning, vigilance, new ideas',
  [`card.${CardName.PAGE_OF_SWORDS}.description`]:
    'Page of Swords is a young keen mind ready to learn and defend the truth. The card speaks of curiosity, study, a thirst for knowledge, and a cautious vigilance in the face of new information.',
  [`card.${CardName.KNIGHT_OF_SWORDS}.meanings`]:
    'ambition, action, swift decisions, determination',
  [`card.${CardName.KNIGHT_OF_SWORDS}.description`]:
    'Knight of Swords charges forward, sword raised, with the wind of ideas at his back. The card speaks of decisive action, ambition, and the courage to defend one’s convictions, though sometimes too hastily.',
  [`card.${CardName.QUEEN_OF_SWORDS}.meanings`]:
    'clarity, independence, honesty, directness',
  [`card.${CardName.QUEEN_OF_SWORDS}.description`]:
    'Queen of Swords sees the world with a clear, sober mind. She speaks of independence, honesty, directness, and the ability to make difficult decisions with an open heart and a cool head.',
  [`card.${CardName.KING_OF_SWORDS}.meanings`]:
    'intellect, authority, truth, justice',
  [`card.${CardName.KING_OF_SWORDS}.description`]:
    'King of Swords rules with the mind, valuing truth, justice, and logic. He speaks of intellectual authority, the ability to make fair decisions, and the wisdom that comes from experience and clear thinking.',

  // Pentacles
  [`card.${CardName.ACE_OF_COINS}.meanings`]:
    'new opportunity, prosperity, material beginning, abundance',
  [`card.${CardName.ACE_OF_COINS}.description`]:
    'Ace of Pentacles is a hand offering a golden coin — a new material opportunity. It speaks of the beginning of a profitable undertaking, financial stability, and the gifts that the material world is ready to give.',
  [`card.${CardName.TWO_OF_COINS}.meanings`]:
    'balance, adaptability, juggling, flexibility',
  [`card.${CardName.TWO_OF_COINS}.description`]:
    'Two of Pentacles depicts a figure juggling two coins in an endless dance. It speaks of the ability to balance several tasks, adapt to change, and gracefully manage the flow of life.',
  [`card.${CardName.THREE_OF_COINS}.meanings`]:
    'teamwork, skill, collaboration, recognition',
  [`card.${CardName.THREE_OF_COINS}.description`]:
    'Three of Pentacles shows craftsmen working together on a cathedral. It speaks of collaboration, the value of each person’s skill, recognition of one’s work, and the result that comes from joint effort.',
  [`card.${CardName.FOUR_OF_COINS}.meanings`]:
    'stability, possession, control, fear of loss',
  [`card.${CardName.FOUR_OF_COINS}.description`]:
    'Four of Pentacles depicts a figure tightly clutching coins. It speaks of stability and the desire to keep what one has, but also warns of greed, fear of loss, and excessive attachment to material things.',
  [`card.${CardName.FIVE_OF_COINS}.meanings`]:
    'hardship, loss, isolation, need for help',
  [`card.${CardName.FIVE_OF_COINS}.description`]:
    'Five of Pentacles shows two figures walking past a stained-glass window in the snow, not noticing the warmth inside. It speaks of hardship, loneliness, and the help that is often closer than it seems.',
  [`card.${CardName.SIX_OF_COINS}.meanings`]:
    'generosity, sharing, charity, balance of giving and receiving',
  [`card.${CardName.SIX_OF_COINS}.description`]:
    'Six of Pentacles depicts a figure distributing coins to those in need. It speaks of generosity, fair distribution of resources, and the balance between giving and receiving.',
  [`card.${CardName.SEVEN_OF_COINS}.meanings`]:
    'patience, investment, assessment, long-term effort',
  [`card.${CardName.SEVEN_OF_COINS}.description`]:
    'Seven of Pentacles shows a figure looking at the fruits of their labour. It speaks of patience, long-term investment, and an honest assessment of whether efforts are bringing the expected harvest.',
  [`card.${CardName.EIGHT_OF_COINS}.meanings`]:
    'diligence, skill, mastery, craftsmanship',
  [`card.${CardName.EIGHT_OF_COINS}.description`]:
    'Eight of Pentacles depicts a craftsman meticulously carving one coin after another. It speaks of hard work, the pursuit of mastery, dedication to one’s craft, and quality that comes with practice.',
  [`card.${CardName.NINE_OF_COINS}.meanings`]:
    'abundance, self-sufficiency, luxury, independence',
  [`card.${CardName.NINE_OF_COINS}.description`]:
    'Nine of Pentacles shows a figure in a garden surrounded by ripe fruits. It speaks of well-deserved abundance, self-sufficiency, the enjoyment of one’s own labour, and refined independence.',
  [`card.${CardName.TEN_OF_COINS}.meanings`]:
    'wealth, family heritage, stability, legacy',
  [`card.${CardName.TEN_OF_COINS}.description`]:
    'Ten of Pentacles depicts a multigenerational family in a prosperous home. It speaks of wealth, family heritage, long-term stability, and the legacy one leaves for future generations.',
  [`card.${CardName.PAGE_OF_COINS}.meanings`]:
    'studiousness, new venture, reliability, learning',
  [`card.${CardName.PAGE_OF_COINS}.description`]:
    'Page of Pentacles is a young student holding a coin and looking at it with attention. The card speaks of a new material endeavour, diligence, reliability, and the first steps toward financial literacy.',
  [`card.${CardName.KNIGHT_OF_COINS}.meanings`]:
    'reliability, patience, methodicalness, routine',
  [`card.${CardName.KNIGHT_OF_COINS}.description`]:
    'Knight of Pentacles rides slowly but surely, like a ploughman in a field. He speaks of reliability, methodicalness, patience, and the steady progress that comes from consistent daily effort.',
  [`card.${CardName.QUEEN_OF_COINS}.meanings`]:
    'nurturing, practicality, abundance, comfort',
  [`card.${CardName.QUEEN_OF_COINS}.description`]:
    'Queen of Pentacles creates a warm and abundant home. She speaks of practicality, caring for loved ones, financial wisdom, and the ability to fill life with comfort and beauty.',
  [`card.${CardName.KING_OF_COINS}.meanings`]:
    'prosperity, security, success, mastery of the material',
  [`card.${CardName.KING_OF_COINS}.description`]:
    'King of Pentacles rules his kingdom with wisdom and abundance. He speaks of financial success, security, the ability to turn effort into results, and the responsible use of material wealth.',

  // Settings
  'Most frequent card': 'Most frequent card',
  'Meanings': 'Meanings',
};

export default TRANSLATIONS_EN;
