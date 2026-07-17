import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';
import TextContainer from '@/shared/ui/TextContainer';
import TRANSLATIONS_EN from '@/shared/locales/en/about';
import TRANSLATIONS_RU from '@/shared/locales/ru/about';
import TRANSLATIONS_EN_CARDS from '@/shared/locales/en/cards';
import TRANSLATIONS_RU_CARDS from '@/shared/locales/ru/cards';
import useLocales from '@/shared/hooks/useLocales';
import type { I18nFn } from '@/entities/TarotCard';

import { THEMES } from '../config/themes';

import styles from './About.module.css';

type Theme = (typeof THEMES)[number];

export const AboutPage = () => {
  const [step, setStep] = useState<'questions' | 'paragraphs'>('questions');
  const [theme, setTheme] = useState<Theme | null>(null);

  const handleBackButtonClick = () => {
    setStep('questions');
  };

  const navigate = useNavigate();

  const { addTranslations, i18n, locale } = useLocales();

  useEffect(() => {
    addTranslations({
      en: { ...TRANSLATIONS_EN, ...TRANSLATIONS_EN_CARDS },
      ru: { ...TRANSLATIONS_RU, ...TRANSLATIONS_RU_CARDS },
    });
  }, [locale]);

  const getParagraphs = (
    currentTheme: Theme,
    translate: I18nFn,
  ): string[] => {
    if ('getParagraphs' in currentTheme) {
      return currentTheme.getParagraphs(translate);
    }

    return currentTheme.paragraphs;
  };

  return (
    <div className={styles.container}>
      {step === 'questions' && (
        <div className={styles.buttons}>
          {THEMES.map((theme) => {
            const { title } = theme;

            const handleThemeButtonClick = () => {
              setStep('paragraphs');

              setTheme(theme);
            };

            return (
              <Button onClick={handleThemeButtonClick} key={title}>
                {i18n(title)}
              </Button>
            );
          })}

          <ArrowButton
            onClick={() => navigate('/tarot')}
            className={styles.arrow}
          />
        </div>
      )}

      {step === 'paragraphs' && theme && (
        <>
          <TextContainer
            paragraphs={getParagraphs(theme, i18n)}
            title={i18n(theme.title)}
            maxHeight={80}
            maxHeightMeasure={'%'}
            children={
              <ArrowButton
                onClick={handleBackButtonClick}
                className={styles.arrow}
              />
            }
          />
        </>
      )}
    </div>
  );
};
