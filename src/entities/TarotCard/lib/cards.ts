import { CardName } from '../types';

/**
 * Localized card info returned to UI.
 */
export interface CardInfo {
  /**
   * Card identifier (used as a key in locales)
   */
  id: `${CardName}`;
  /**
   * Original (English) name of the card
   */
  name: string;
  /**
   * Original (English) meanings of the card
   */
  meanings: string;
  /**
   * Original (English) description of the card
   */
  description: string;
}

/**
 * Single source of truth for all 78 tarot cards.
 *
 * Contains English (original) texts, which are also used as fallback
 * translations through the i18n mechanism: if a key is not present
 * in the locale dictionary, `i18n(id)` returns the key itself.
 *
 * The `id` is the locale key, while `name`, `meanings` and
 * `description` are derived keys with the prefixes:
 *  - `name`      → `card.<id>.name`
 *  - `meanings`  → `card.<id>.meanings`
 *  - `description` → `card.<id>.description`
 */
export const ALL_CARDS: readonly CardInfo[] = [
  // ============== Major Arcana ==============
  {
    id: CardName.THE_FOOL,
    name: 'The Fool',
    meanings: 'beginning of a journey, risk, potential, naivety',
    description:
      'The Fool is intended for new beginnings, expanding horizons and using the chance suggested by intuition. This card also indicates naivety and excitement about the unknown.',
  },
  {
    id: CardName.THE_MAGICIAN,
    name: 'The Magician',
    meanings: 'manifestation, healing, spirituality, connection with the divine',
    description:
      'The Magician represents the ability to understand and control invisible forces of the Universe. In a spread, this card indicates a special gift of a person that has not yet been used.',
  },
  {
    id: CardName.THE_HIGH_PRIESTESS,
    name: 'The High Priestess',
    meanings:
      'divine feminine principle, human wisdom, study of nature, spiritual mystery, inner world',
    description:
      'The High Priestess symbolizes the feminine spiritual principle, endows with it, and in case of loss of such energy, absorbs it back into herself.',
  },
  {
    id: CardName.THE_EMPRESS,
    name: 'The Empress',
    meanings: 'nature, great mother, fertility',
    description:
      'The Empress, in contrast to the divinity of the High Priestess, represents the natural feminine principle, symbol of the mother of all.',
  },
  {
    id: CardName.THE_EMPEROR,
    name: 'The Emperor',
    meanings: 'leadership, influence, stability, potential for mastery',
    description:
      'If the Empress is the figure of mother, then the Emperor is father. He symbolizes primacy, strength and power in nature, and must be reckoned with.',
  },
  {
    id: CardName.THE_HIEROPHANT,
    name: 'The Hierophant',
    meanings:
      'practical lessons related to natural law, learning, mastering chosen field of knowledge',
    description:
      'The Hierophant is as powerful as the Emperor, but tends to draw strength not from nature, but from the spiritual. Sometimes indicates the desire to break free from limitations to follow the divine path.',
  },
  {
    id: CardName.THE_LOVERS,
    name: 'The Lovers',
    meanings: 'difficult decisions, changes in relationships, compromise',
    description:
      'The Lovers speak of deep intimacy, reminding that relationships give a person value.',
  },
  {
    id: CardName.THE_CHARIOT,
    name: 'The Chariot',
    meanings:
      'controlling opposing forces, resolving conflict, willpower, journey',
    description:
      'The Chariot represents control over internal contradictions. It may also indicate the possibility of travel.',
  },
  {
    id: CardName.STRENGTH,
    name: 'Strength',
    meanings:
      'need for discipline, clarifying personal interests to achieve harmony with inner self',
    description:
      'Strength is depicted as a woman gently controlling a powerful lion. The card means inner strength, overcoming weaknesses, courage and perseverance. In some interpretations, it is also viewed as a symbol of fighting animal nature or harmony with instincts.',
  },
  {
    id: CardName.THE_HERMIT,
    name: 'The Hermit',
    meanings:
      'self-analysis, contemplation, inner reflection, benefit of time spent alone',
    description:
      'The Hermit is turning inward, reflecting, often in solitude. The card is associated with inner wisdom, self-assessment, often calls for self-analysis. Moreover, The Hermit in a spread may hint that there is a guide nearby offering help.',
  },
  {
    id: CardName.WHEEL_OF_FORTUNE,
    name: 'Wheel of Fortune',
    meanings:
      'inevitable and often positive transformations, cycles of life, beginning and end',
    description:
      'Wheel of Fortune symbolizes the inevitability of change, starting and ending points. Also indicates crossroads of fate when choosing breaks patterns.',
  },
  {
    id: CardName.JUSTICE,
    name: 'Justice',
    meanings: 'justice, moral sensitivity, karma, attention to detail',
    description:
      'Justice is truth, balance and objectivity. Emotional equilibrium follows correct choice, even if it is difficult.',
  },
  {
    id: CardName.THE_HANGED_MAN,
    name: 'The Hanged Man',
    meanings: 'consequences, stagnation, situation that needs to be endured',
    description:
      'The Hanged Man symbolizes sacrifice and the need to look at things from a different perspective. In a spread, it may call for surrender or abandoning patterned actions.',
  },
  {
    id: CardName.DEATH,
    name: 'Death',
    meanings: 'ending, moving forward, personal liberation',
    description:
      'Death looks ominous, but does not prophesy actual death of a person. This is a card of change that mostly occurs during personal growth when we free ourselves from old behavioral patterns. Death indicates necessary reset to continue the journey.',
  },
  {
    id: CardName.TEMPERANCE,
    name: 'Temperance',
    meanings: 'balance, self-development',
    description:
      'Temperance means self-improvement and avoiding extremes. It appears in a spread when a person is not in harmony with himself. The main meaning of the card is to suggest restoring balance.',
  },
  {
    id: CardName.THE_DEVIL,
    name: 'The Devil',
    meanings: 'trap, unhealthy relationships, material pleasures',
    description:
      "The Devil speaks of inner demons. This card often appears when unhealthy behavioral patterns are activated, whether it's failed relationships, negative self-talk, or addictions.",
  },
  {
    id: CardName.THE_TOWER,
    name: 'The Tower',
    meanings: 'possible or real danger, unexpected upheaval',
    description:
      'The Tower is one of the most ominous cards, as it usually foretells serious changes, destruction and even threats. It symbolizes chaos, as well as approaching a dramatic end.',
  },
  {
    id: CardName.THE_STAR,
    name: 'The Star',
    meanings:
      'spirituality, purpose, connection with the divine, excellence, inspiration',
    description:
      'The Star carries a deep and powerful message, especially for those experiencing rebirth. After stress or destruction, it asks to spend time on self-analysis and heal wounds.',
  },
  {
    id: CardName.THE_MOON,
    name: 'The Moon',
    meanings: 'illusion, impressionability, deception, confusion, discord',
    description:
      'The Moon speaks of a good time for deep work with the subconscious, of readiness to see and accept the real self. The card calls to free emotions from control to reach the most precious inside oneself.',
  },
  {
    id: CardName.THE_SUN,
    name: 'The Sun',
    meanings: 'vitality, joy, luck, confidence, authenticity',
    description:
      'The Sun is one of the most positive cards. It symbolizes happiness, success, pleasure, self-expression and life force.',
  },
  {
    id: CardName.JUDGEMENT,
    name: 'Judgement',
    meanings: 'resurrection, awakening, necessity of making decisions',
    description:
      'Judgement refers to Christianity: on Judgment Day God will reveal the righteous and sinners, reward or punish. This card awakens to make corrections in life.',
  },
  {
    id: CardName.THE_WORLD,
    name: 'The World',
    meanings: 'end of cycle, significant change, self-realization',
    description:
      'The World is a big step forward, a card of absorbing lessons and wisdom. It indicates new understanding of life and role in it, speaks of personal growth and brings satisfaction.',
  },

  // ============== Wands (fire) ==============
  {
    id: CardName.ACE_OF_WANDS,
    name: 'Ace of Wands',
    meanings: 'inspiration, new venture, spark of creativity, energy',
    description:
      'Ace of Wands is the seed of creative power, a flash of inspiration that demands action. It signals the beginning of an energetic endeavour, courage to start, and the inner fire needed to bring an idea to life.',
  },
  {
    id: CardName.TWO_OF_WANDS,
    name: 'Two of Wands',
    meanings: 'planning, decisions, future vision, personal power',
    description:
      'Two of Wands indicates that a person holds the world in their hands and makes deliberate choices about the future. It speaks of strategic planning, leaving the comfort zone, and considering the path forward with confidence.',
  },
  {
    id: CardName.THREE_OF_WANDS,
    name: 'Three of Wands',
    meanings: 'expansion, foresight, overseas opportunities, progress',
    description:
      'Three of Wands is the card of a merchant looking out over the sea, waiting for ships to return. It represents expansion of horizons, long-term investments paying off, and the fruits of well-thought-out plans.',
  },
  {
    id: CardName.FOUR_OF_WANDS,
    name: 'Four of Wands',
    meanings: 'celebration, harmony, homecoming, community',
    description:
      'Four of Wands symbolizes a joyful celebration, a warm homecoming, and harmony with close ones. It indicates a stable foundation, a happy family or community, and milestones worth celebrating together.',
  },
  {
    id: CardName.FIVE_OF_WANDS,
    name: 'Five of Wands',
    meanings: 'competition, conflict, tension, rivalry',
    description:
      'Five of Wands depicts a struggle between several opponents, all trying to occupy the same place. It speaks of petty conflicts, competition, and disagreements that are exhausting but rarely bring real harm.',
  },
  {
    id: CardName.SIX_OF_WANDS,
    name: 'Six of Wands',
    meanings: 'victory, recognition, success, public acclaim',
    description:
      'Six of Wands is the card of triumph and recognition. It points to a well-deserved victory, public acknowledgment, and confidence that comes from having overcome challenges and proven oneself.',
  },
  {
    id: CardName.SEVEN_OF_WANDS,
    name: 'Seven of Wands',
    meanings: 'defence, perseverance, standing your ground, challenges',
    description:
      'Seven of Wands shows a person defending a higher position from attackers below. It speaks of the need to hold one’s ground, maintain convictions, and keep fighting despite outside pressure.',
  },
  {
    id: CardName.EIGHT_OF_WANDS,
    name: 'Eight of Wands',
    meanings: 'swift action, movement, quick decisions, momentum',
    description:
      'Eight of Wands represents rapid movement, swift progress, and events unfolding at great speed. It often speaks of travel, messages, and a momentum that is hard to stop — the moment to act is now.',
  },
  {
    id: CardName.NINE_OF_WANDS,
    name: 'Nine of Wands',
    meanings: 'resilience, last stand, persistence, caution',
    description:
      'Nine of Wands depicts a wounded but still standing warrior, ready for one more fight. It speaks of resilience, lessons learned through hardship, and the wisdom of conserving energy while remaining vigilant.',
  },
  {
    id: CardName.TEN_OF_WANDS,
    name: 'Ten of Wands',
    meanings: 'burden, responsibility, hard work, completion',
    description:
      'Ten of Wands shows a man carrying an excessive load of sticks towards a city. It speaks of taking on too much, the weight of responsibility, and the importance of knowing when to set down the burden and ask for help.',
  },
  {
    id: CardName.PAGE_OF_WANDS,
    name: 'Page of Wands',
    meanings: 'enthusiasm, exploration, discovery, free spirit',
    description:
      'Page of Wands is a young explorer full of enthusiasm and curiosity. The card signals news, an inspiring idea, or the beginning of an adventure. It is a call to follow one’s enthusiasm and explore the unknown.',
  },
  {
    id: CardName.KNIGHT_OF_WANDS,
    name: 'Knight of Wands',
    meanings: 'energy, passion, action, impulsiveness',
    description:
      'Knight of Wands charges forward like a fiery horseman, full of courage, passion, and the desire for change. The card represents bold action, daring initiative, and at times — haste that should be tempered with forethought.',
  },
  {
    id: CardName.QUEEN_OF_WANDS,
    name: 'Queen of Wands',
    meanings: 'confidence, independence, determination, warmth',
    description:
      'Queen of Wands embodies self-confidence, charisma, and warm determination. She is a leader who knows her worth, easily inspires others, and creates a life around her on her own terms.',
  },
  {
    id: CardName.KING_OF_WANDS,
    name: 'King of Wands',
    meanings: 'leadership, vision, mastery, authority',
    description:
      'King of Wands is a mature leader who combines vision with the energy to bring it to life. He speaks of mastery, authority, honesty, and the ability to inspire others through personal example.',
  },

  // ============== Cups (water) ==============
  {
    id: CardName.ACE_OF_CUPS,
    name: 'Ace of Cups',
    meanings: 'new feelings, love, emotional beginning, intuition',
    description:
      'Ace of Cups is a chalice overflowing with pure emotion. It signals the beginning of a deep feeling, new love, spiritual awakening, or emotional fulfilment that nourishes the soul.',
  },
  {
    id: CardName.TWO_OF_CUPS,
    name: 'Two of Cups',
    meanings: 'partnership, mutual attraction, union, harmony',
    description:
      'Two of Cups depicts two people exchanging cups in a gesture of mutual recognition. It speaks of partnership, harmonious relationships, emotional balance, and the meeting of two hearts.',
  },
  {
    id: CardName.THREE_OF_CUPS,
    name: 'Three of Cups',
    meanings: 'friendship, celebration, community, joy',
    description:
      'Three of Cups is a card of joyful friendship and shared celebration. It speaks of close friends, parties, support, and the joy that comes from being accepted and surrounded by one’s tribe.',
  },
  {
    id: CardName.FOUR_OF_CUPS,
    name: 'Four of Cups',
    meanings: 'apathy, contemplation, re-evaluation, missed opportunity',
    description:
      'Four of Cups depicts a person sitting under a tree, lost in thought, while a cup is being offered. It speaks of emotional stagnation, missed opportunities, and the need to look within to find new motivation.',
  },
  {
    id: CardName.FIVE_OF_CUPS,
    name: 'Five of Cups',
    meanings: 'loss, grief, disappointment, focusing on the negative',
    description:
      'Five of Cups shows a figure mourning three spilled cups while two stand behind untouched. It speaks of disappointment, grief, and the human tendency to focus on what is lost rather than what remains.',
  },
  {
    id: CardName.SIX_OF_CUPS,
    name: 'Six of Cups',
    meanings: 'nostalgia, memories, childhood, reunion',
    description:
      'Six of Cups is filled with warm nostalgia, memories of childhood, and meetings with people from the past. It speaks of kindness, innocence, and the wisdom of learning from one’s roots.',
  },
  {
    id: CardName.SEVEN_OF_CUPS,
    name: 'Seven of Cups',
    meanings: 'choices, fantasies, illusions, wishful thinking',
    description:
      'Seven of Cups shows a figure surrounded by visions, dreams, and temptations. It speaks of a moment of choice, the danger of illusions, and the need to distinguish between real opportunities and fantasies.',
  },
  {
    id: CardName.EIGHT_OF_CUPS,
    name: 'Eight of Cups',
    meanings: 'leaving behind, search for meaning, transition, inner journey',
    description:
      'Eight of Cups depicts a figure walking away from stacked cups into the mountains. It speaks of the conscious decision to leave behind what no longer satisfies, in search of a deeper meaning.',
  },
  {
    id: CardName.NINE_OF_CUPS,
    name: 'Nine of Cups',
    meanings: 'satisfaction, wish fulfilled, contentment, well-being',
    description:
      'Nine of Cups is the card of emotional satisfaction and the fulfilment of wishes. It speaks of abundance, gratitude, harmony with oneself, and a moment when life feels complete.',
  },
  {
    id: CardName.TEN_OF_CUPS,
    name: 'Ten of Cups',
    meanings: 'happiness, family, harmony, lasting love',
    description:
      'Ten of Cups is the card of true family happiness and emotional fulfilment. It speaks of a strong relationship, a loving home, and a sense of belonging that nourishes all members of the family.',
  },
  {
    id: CardName.PAGE_OF_CUPS,
    name: 'Page of Cups',
    meanings: 'creative message, sensitivity, dreaminess, intuition',
    description:
      'Page of Cups is a young dreamer who looks at a cup from which a fish peeks out. The card speaks of a creative message, intuition, sensitivity, and the first signs of new feelings.',
  },
  {
    id: CardName.KNIGHT_OF_CUPS,
    name: 'Knight of Cups',
    meanings: 'romance, charm, pursuit of dreams, idealist',
    description:
      'Knight of Cups rides forward offering a cup, the messenger of feelings and romance. The card represents the pursuit of dreams, charm, imagination, and a readiness to follow the call of the heart.',
  },
  {
    id: CardName.QUEEN_OF_CUPS,
    name: 'Queen of Cups',
    meanings: 'compassion, empathy, intuition, emotional wisdom',
    description:
      'Queen of Cups is a deeply intuitive and compassionate figure. She speaks of emotional wisdom, the ability to listen, and the gift of sensing the feelings of others, sometimes at the cost of her own boundaries.',
  },
  {
    id: CardName.KING_OF_CUPS,
    name: 'King of Cups',
    meanings: 'emotional balance, diplomacy, calm, wisdom of feelings',
    description:
      'King of Cups holds the ocean of feelings in calm hands. He speaks of mature emotional intelligence, the ability to stay calm in storms, diplomacy, and a deep understanding of human nature.',
  },

  // ============== Swords (air) ==============
  {
    id: CardName.ACE_OF_SWORDS,
    name: 'Ace of Swords',
    meanings: 'clarity, breakthrough, truth, new idea',
    description:
      'Ace of Swords is a flash of mental clarity that cuts through confusion. It speaks of truth, a new idea, victory of the mind, and the moment when a difficult situation finally becomes clear.',
  },
  {
    id: CardName.TWO_OF_SWORDS,
    name: 'Two of Swords',
    meanings: 'difficult choice, stalemate, indecision, balance',
    description:
      'Two of Swords depicts a blindfolded figure with two crossed swords. It speaks of a difficult choice, a stalemate, and the need for inner balance before making a decision that will affect the future.',
  },
  {
    id: CardName.THREE_OF_SWORDS,
    name: 'Three of Swords',
    meanings: 'heartbreak, sorrow, painful truth, grief',
    description:
      'Three of Swords shows a heart pierced by three blades. It is the card of painful truth, heartbreak, and grief, but also of the cleansing that comes when one allows oneself to feel pain.',
  },
  {
    id: CardName.FOUR_OF_SWORDS,
    name: 'Four of Swords',
    meanings: 'rest, recuperation, contemplation, pause',
    description:
      'Four of Swords depicts a figure lying in silence, eyes closed, in a stained-glass window. It speaks of the need for rest, recovery, and reflection before continuing on the path.',
  },
  {
    id: CardName.FIVE_OF_SWORDS,
    name: 'Five of Swords',
    meanings: 'conflict, defeat, pyrrhic victory, tension',
    description:
      'Five of Swords depicts a man collecting swords after a conflict in which he has won but at a cost. It speaks of hollow victories, conflicts that are won but leave a bitter aftertaste.',
  },
  {
    id: CardName.SIX_OF_SWORDS,
    name: 'Six of Swords',
    meanings: 'transition, moving on, journey, leaving difficulties behind',
    description:
      'Six of Swords shows people in a boat sailing away from troubled waters. It speaks of leaving the past behind, gradual recovery, and a transition that, though not easy, leads to calmer shores.',
  },
  {
    id: CardName.SEVEN_OF_SWORDS,
    name: 'Seven of Swords',
    meanings: 'deception, strategy, stealth, avoidance',
    description:
      'Seven of Swords depicts a figure quietly taking swords from a camp. It speaks of cunning, avoidance, possible deception, and the need to be alert to those who act behind one’s back.',
  },
  {
    id: CardName.EIGHT_OF_SWORDS,
    name: 'Eight of Swords',
    meanings: 'self-restriction, victimhood, illusion of captivity, fear',
    description:
      'Eight of Swords shows a blindfolded figure surrounded by swords. Although the path is open, the person sees no way out. The card speaks of self-imposed limitations and the fear that holds one back.',
  },
  {
    id: CardName.NINE_OF_SWORDS,
    name: 'Nine of Swords',
    meanings: 'anxiety, worry, nightmares, mental anguish',
    description:
      'Nine of Swords depicts a figure sitting up in bed at night, head in hands, surrounded by swords. It speaks of anxiety, night thoughts, worries that amplify in the dark, and the need to share one’s burden.',
  },
  {
    id: CardName.TEN_OF_SWORDS,
    name: 'Ten of Swords',
    meanings: 'ending, rock bottom, completion, painful finale',
    description:
      'Ten of Swords shows a figure lying face down with ten swords in their back. It is the card of the final fall, the end of a difficult cycle, but also the point after which the only way is up — a new dawn is coming.',
  },
  {
    id: CardName.PAGE_OF_SWORDS,
    name: 'Page of Swords',
    meanings: 'curiosity, learning, vigilance, new ideas',
    description:
      'Page of Swords is a young keen mind ready to learn and defend the truth. The card speaks of curiosity, study, a thirst for knowledge, and a cautious vigilance in the face of new information.',
  },
  {
    id: CardName.KNIGHT_OF_SWORDS,
    name: 'Knight of Swords',
    meanings: 'ambition, action, swift decisions, determination',
    description:
      'Knight of Swords charges forward, sword raised, with the wind of ideas at his back. The card speaks of decisive action, ambition, and the courage to defend one’s convictions, though sometimes too hastily.',
  },
  {
    id: CardName.QUEEN_OF_SWORDS,
    name: 'Queen of Swords',
    meanings: 'clarity, independence, honesty, directness',
    description:
      'Queen of Swords sees the world with a clear, sober mind. She speaks of independence, honesty, directness, and the ability to make difficult decisions with an open heart and a cool head.',
  },
  {
    id: CardName.KING_OF_SWORDS,
    name: 'King of Swords',
    meanings: 'intellect, authority, truth, justice',
    description:
      'King of Swords rules with the mind, valuing truth, justice, and logic. He speaks of intellectual authority, the ability to make fair decisions, and the wisdom that comes from experience and clear thinking.',
  },

  // ============== Pentacles (earth) ==============
  {
    id: CardName.ACE_OF_COINS,
    name: 'Ace of Pentacles',
    meanings: 'new opportunity, prosperity, material beginning, abundance',
    description:
      'Ace of Pentacles is a hand offering a golden coin — a new material opportunity. It speaks of the beginning of a profitable undertaking, financial stability, and the gifts that the material world is ready to give.',
  },
  {
    id: CardName.TWO_OF_COINS,
    name: 'Two of Pentacles',
    meanings: 'balance, adaptability, juggling, flexibility',
    description:
      'Two of Pentacles depicts a figure juggling two coins in an endless dance. It speaks of the ability to balance several tasks, adapt to change, and gracefully manage the flow of life.',
  },
  {
    id: CardName.THREE_OF_COINS,
    name: 'Three of Pentacles',
    meanings: 'teamwork, skill, collaboration, recognition',
    description:
      'Three of Pentacles shows craftsmen working together on a cathedral. It speaks of collaboration, the value of each person’s skill, recognition of one’s work, and the result that comes from joint effort.',
  },
  {
    id: CardName.FOUR_OF_COINS,
    name: 'Four of Pentacles',
    meanings: 'stability, possession, control, fear of loss',
    description:
      'Four of Pentacles depicts a figure tightly clutching coins. It speaks of stability and the desire to keep what one has, but also warns of greed, fear of loss, and excessive attachment to material things.',
  },
  {
    id: CardName.FIVE_OF_COINS,
    name: 'Five of Pentacles',
    meanings: 'hardship, loss, isolation, need for help',
    description:
      'Five of Pentacles shows two figures walking past a stained-glass window in the snow, not noticing the warmth inside. It speaks of hardship, loneliness, and the help that is often closer than it seems.',
  },
  {
    id: CardName.SIX_OF_COINS,
    name: 'Six of Pentacles',
    meanings: 'generosity, sharing, charity, balance of giving and receiving',
    description:
      'Six of Pentacles depicts a figure distributing coins to those in need. It speaks of generosity, fair distribution of resources, and the balance between giving and receiving.',
  },
  {
    id: CardName.SEVEN_OF_COINS,
    name: 'Seven of Pentacles',
    meanings: 'patience, investment, assessment, long-term effort',
    description:
      'Seven of Pentacles shows a figure looking at the fruits of their labour. It speaks of patience, long-term investment, and an honest assessment of whether efforts are bringing the expected harvest.',
  },
  {
    id: CardName.EIGHT_OF_COINS,
    name: 'Eight of Pentacles',
    meanings: 'diligence, skill, mastery, craftsmanship',
    description:
      'Eight of Pentacles depicts a craftsman meticulously carving one coin after another. It speaks of hard work, the pursuit of mastery, dedication to one’s craft, and quality that comes with practice.',
  },
  {
    id: CardName.NINE_OF_COINS,
    name: 'Nine of Pentacles',
    meanings: 'abundance, self-sufficiency, luxury, independence',
    description:
      'Nine of Pentacles shows a figure in a garden surrounded by ripe fruits. It speaks of well-deserved abundance, self-sufficiency, the enjoyment of one’s own labour, and refined independence.',
  },
  {
    id: CardName.TEN_OF_COINS,
    name: 'Ten of Pentacles',
    meanings: 'wealth, family heritage, stability, legacy',
    description:
      'Ten of Pentacles depicts a multigenerational family in a prosperous home. It speaks of wealth, family heritage, long-term stability, and the legacy one leaves for future generations.',
  },
  {
    id: CardName.PAGE_OF_COINS,
    name: 'Page of Pentacles',
    meanings: 'studiousness, new venture, reliability, learning',
    description:
      'Page of Pentacles is a young student holding a coin and looking at it with attention. The card speaks of a new material endeavour, diligence, reliability, and the first steps toward financial literacy.',
  },
  {
    id: CardName.KNIGHT_OF_COINS,
    name: 'Knight of Pentacles',
    meanings: 'reliability, patience, methodicalness, routine',
    description:
      'Knight of Pentacles rides slowly but surely, like a ploughman in a field. He speaks of reliability, methodicalness, patience, and the steady progress that comes from consistent daily effort.',
  },
  {
    id: CardName.QUEEN_OF_COINS,
    name: 'Queen of Pentacles',
    meanings: 'nurturing, practicality, abundance, comfort',
    description:
      'Queen of Pentacles creates a warm and abundant home. She speaks of practicality, caring for loved ones, financial wisdom, and the ability to fill life with comfort and beauty.',
  },
  {
    id: CardName.KING_OF_COINS,
    name: 'King of Pentacles',
    meanings: 'prosperity, security, success, mastery of the material',
    description:
      'King of Pentacles rules his kingdom with wisdom and abundance. He speaks of financial success, security, the ability to turn effort into results, and the responsible use of material wealth.',
  },
];

/**
 * Get card info by card id.
 */
export const getCardInfo = (id: `${CardName}`): CardInfo | undefined => {
  return ALL_CARDS.find((card) => card.id === id);
};
