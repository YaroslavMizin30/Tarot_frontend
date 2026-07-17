import type { Locale } from '@/shared/hooks/useLocales';

import type { MoonPhaseName, ZodiacSign } from '../types';

interface DailyGuidanceInput {
  date: string;
  isMoonVoidOfCourse: boolean;
  locale: Locale;
  moonSign: ZodiacSign;
  phase: MoonPhaseName;
}

export interface DailyGuidance {
  id: string;
  context: string;
  summary: string;
}

const PHASE_LABELS: Record<Locale, Record<MoonPhaseName, string>> = {
  en: {
    'New Moon': 'New Moon',
    'Waxing Crescent': 'Waxing Crescent',
    'First Quarter': 'First Quarter',
    'Waxing Gibbous': 'Waxing Gibbous',
    'Full Moon': 'Full Moon',
    'Waning Gibbous': 'Waning Gibbous',
    'Last Quarter': 'Last Quarter',
    'Waning Crescent': 'Waning Crescent',
  },
  ru: {
    'New Moon': 'Новолуние',
    'Waxing Crescent': 'Растущий серп',
    'First Quarter': 'Первая четверть',
    'Waxing Gibbous': 'Растущая Луна',
    'Full Moon': 'Полнолуние',
    'Waning Gibbous': 'Убывающая Луна',
    'Last Quarter': 'Последняя четверть',
    'Waning Crescent': 'Убывающий серп',
  },
};

const SIGN_LABELS: Record<Locale, Record<ZodiacSign, string>> = {
  en: {
    Aries: 'Aries',
    Taurus: 'Taurus',
    Gemini: 'Gemini',
    Cancer: 'Cancer',
    Leo: 'Leo',
    Virgo: 'Virgo',
    Libra: 'Libra',
    Scorpio: 'Scorpio',
    Sagittarius: 'Sagittarius',
    Capricorn: 'Capricorn',
    Aquarius: 'Aquarius',
    Pisces: 'Pisces',
  },
  ru: {
    Aries: 'Овне',
    Taurus: 'Тельце',
    Gemini: 'Близнецах',
    Cancer: 'Раке',
    Leo: 'Льве',
    Virgo: 'Деве',
    Libra: 'Весах',
    Scorpio: 'Скорпионе',
    Sagittarius: 'Стрельце',
    Capricorn: 'Козероге',
    Aquarius: 'Водолее',
    Pisces: 'Рыбах',
  },
};

const SIGN_FOCUS: Record<Locale, Record<ZodiacSign, string>> = {
  en: {
    Aries: 'initiative and personal boundaries',
    Taurus: 'resources, the body, and a sustainable pace',
    Gemini: 'information, learning, and conversations',
    Cancer: 'home and emotional security',
    Leo: 'self-expression and visible contribution',
    Virgo: 'routines, health, and practical details',
    Libra: 'agreements and balance in relationships',
    Scorpio: 'difficult emotions and hidden motives',
    Sagittarius: 'long-term perspective and learning',
    Capricorn: 'commitments, structure, and responsibility',
    Aquarius: 'new approaches and collective tasks',
    Pisces: 'recovery, imagination, and inner signals',
  },
  ru: {
    Aries: 'инициативой и личными границами',
    Taurus: 'ресурсами, телом и устойчивым ритмом',
    Gemini: 'информацией, обучением и разговорами',
    Cancer: 'домом и эмоциональной безопасностью',
    Leo: 'самовыражением и заметным вкладом',
    Virgo: 'рутиной, здоровьем и практическими деталями',
    Libra: 'договорённостями и балансом в отношениях',
    Scorpio: 'сложными эмоциями и скрытыми мотивами',
    Sagittarius: 'долгосрочной перспективой и обучением',
    Capricorn: 'обязательствами, структурой и ответственностью',
    Aquarius: 'новыми подходами и совместными задачами',
    Pisces: 'восстановлением, воображением и внутренними сигналами',
  },
};

const PHASE_GUIDANCE: Record<
  Locale,
  Record<MoonPhaseName, [string, string]>
> = {
  en: {
    'New Moon': [
      'Choose one intention connected with {focus}, then write down a next step that takes no more than 20 minutes.',
      'Define one result you want in matters of {focus}. Leave the rest of the plans outside today’s focus.',
    ],
    'Waxing Crescent': [
      'Take the smallest visible action in matters of {focus}. Progress matters more today than a perfect plan.',
      'Return to an idea connected with {focus} and give it one concrete resource: time, attention, or money.',
    ],
    'First Quarter': [
      'Name one decision you have postponed in matters of {focus}. Check the facts and choose the next reversible step.',
      'Find the obstacle slowing progress in matters of {focus}. Work on that constraint instead of adding another task.',
    ],
    'Waxing Gibbous': [
      'Review work already in progress around {focus}. Improve the weakest part before starting something new.',
      'Ask for specific feedback on a task connected with {focus}, then make one correction while the context is fresh.',
    ],
    'Full Moon': [
      'Compare expectations with the actual result in matters of {focus}. Record what worked before reacting to what did not.',
      'Notice where tension has accumulated around {focus}. Clarify one expectation instead of leaving it unspoken.',
    ],
    'Waning Gibbous': [
      'Write down what has already worked in matters of {focus}. Preserve that practice and stop repeating the rest.',
      'Complete one promise connected with {focus}, or renegotiate it clearly if it is no longer realistic.',
    ],
    'Last Quarter': [
      'Remove one unnecessary commitment related to {focus}. Use the released time to finish something important.',
      'Review your routine around {focus}. Keep the useful step and deliberately discard one complication.',
    ],
    'Waning Crescent': [
      'Finish one small task connected with {focus}, then reserve time for recovery without adding a new obligation.',
      'Summarize what you learned about {focus}. Write one conclusion you want to carry into the next cycle.',
    ],
  },
  ru: {
    'New Moon': [
      'Выберите одно намерение, связанное с {focus}, и запишите следующий шаг, который займёт не больше 20 минут.',
      'Определите один желаемый результат в вопросах, связанных с {focus}. Остальные планы сегодня оставьте за рамками фокуса.',
    ],
    'Waxing Crescent': [
      'Сделайте самое маленькое заметное действие в вопросах, связанных с {focus}. Продвижение сегодня важнее идеального плана.',
      'Вернитесь к идее, связанной с {focus}, и выделите ей один конкретный ресурс: время, внимание или деньги.',
    ],
    'First Quarter': [
      'Назовите одно отложенное решение в вопросах, связанных с {focus}. Проверьте факты и выберите обратимый следующий шаг.',
      'Найдите препятствие, которое тормозит дела, связанные с {focus}. Поработайте с ограничением вместо добавления новой задачи.',
    ],
    'Waxing Gibbous': [
      'Пересмотрите уже начатую работу, связанную с {focus}. Улучшите самое слабое место, прежде чем начинать новое.',
      'Запросите конкретную обратную связь по задаче, связанной с {focus}, и внесите одну правку, пока контекст ещё свежий.',
    ],
    'Full Moon': [
      'Сравните ожидания с фактическим результатом в вопросах, связанных с {focus}. Сначала отметьте, что сработало.',
      'Обратите внимание, где накопилось напряжение вокруг тем, связанных с {focus}. Проясните одно ожидание, которое осталось невысказанным.',
    ],
    'Waning Gibbous': [
      'Запишите, что уже сработало в вопросах, связанных с {focus}. Сохраните эту практику и не повторяйте остальное.',
      'Выполните одно обещание, связанное с {focus}, или прямо пересогласуйте его, если оно больше нереалистично.',
    ],
    'Last Quarter': [
      'Уберите одно необязательное обязательство, связанное с {focus}. Освободившееся время направьте на завершение важного дела.',
      'Пересмотрите привычный подход к вопросам, связанным с {focus}. Оставьте полезный шаг и сознательно уберите одно усложнение.',
    ],
    'Waning Crescent': [
      'Закончите одно небольшое дело, связанное с {focus}, а затем оставьте время на восстановление без новых обязательств.',
      'Подведите итог тому, что узнали в вопросах, связанных с {focus}. Запишите один вывод, который хотите взять в следующий цикл.',
    ],
  },
};

const VOID_GUIDANCE: Record<Locale, string> = {
  en: 'Use today for routine work and review. Before an irreversible decision, verify the missing facts and return to it with a clear head.',
  ru: 'Используйте день для рутинных дел и проверки сделанного. Перед необратимым решением соберите недостающие факты и вернитесь к нему со свежей головой.',
};

const getVariantIndex = (date: string) =>
  [...date].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 2;

export const getDailyGuidance = ({
  date,
  isMoonVoidOfCourse,
  locale,
  moonSign,
  phase,
}: DailyGuidanceInput): DailyGuidance => {
  const context =
    locale === 'ru'
      ? `${PHASE_LABELS.ru[phase]} · Луна в ${SIGN_LABELS.ru[moonSign]}`
      : `${PHASE_LABELS.en[phase]} · Moon in ${SIGN_LABELS.en[moonSign]}`;

  if (isMoonVoidOfCourse) {
    return {
      id: `${date}-moon-void`,
      context,
      summary: VOID_GUIDANCE[locale],
    };
  }

  const variant = getVariantIndex(date);
  const summary = PHASE_GUIDANCE[locale][phase][variant].replace(
    '{focus}',
    SIGN_FOCUS[locale][moonSign],
  );

  return {
    id: `${date}-${phase}-${moonSign}-${variant}`,
    context,
    summary,
  };
};
