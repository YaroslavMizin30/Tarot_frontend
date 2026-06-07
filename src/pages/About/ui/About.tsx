import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/shared/ui/Button';
import ArrowButton from '@/shared/ui/ArrowButton';
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

  const navigate = useNavigate();

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

          <ArrowButton
            onClick={() => navigate('/')}
            className={styles.arrow}
          />
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
