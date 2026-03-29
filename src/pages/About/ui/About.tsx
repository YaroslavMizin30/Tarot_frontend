import React, { useEffect, useState } from 'react';

import Button from '@/shared/ui/Button';
import Arrow from '@/shared/assets/svg/common/deck-arrow.svg?react';
import TextContainer from '@/shared/ui/TextContainer';
import TRANSLATIONS_EN from '@/shared/locales/en/about';
import TRANSLATIONS_RU from '@/shared/locales/ru/about';
import useLocales from '@/shared/hooks/useLocales';

import { THEMES } from '../config/themes';

import styles from './About.module.css';

export const AboutPage = () => {
  const [step, setStep] = useState<'questions' | 'paragraphs'>('questions');
  const [theme, setTheme] = useState<{ title: string; paragraphs: string[] }>({
    title: '',
    paragraphs: [],
  });

  const handleBackButtonClick = () => {
    setStep('questions');
  };

  const { addTranslations, i18n, locale } = useLocales();

  useEffect(() => {
    addTranslations({
      en: TRANSLATIONS_EN,
      ru: TRANSLATIONS_RU,
    });
  }, [locale]);

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
        </div>
      )}

      {step === 'paragraphs' && (
        <>
          <TextContainer
            paragraphs={theme.paragraphs}
            title={theme.title}
            maxHeight={80}
            maxHeightMeasure={'%'}
            children={
              <Arrow
                width={30}
                height={30}
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
