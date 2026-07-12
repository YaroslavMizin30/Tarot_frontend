import { type FC } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import Accordion from '@/shared/ui/Accordion';
import type { AccordionItem } from '@/shared/ui/Accordion';
import Price from '@/shared/ui/Price';

import type { ThemeProps } from './Themes.props';

import styles from './Themes.module.css';
import Button from '@/shared/ui/Button';

const Themes: FC<ThemeProps> = (props) => {
  const { onQuestionChoose, themes } = props;

  const { i18n } = useLocales();

  const handleOwnQuestionClick = () => {
    onQuestionChoose({
      label: i18n('My own question'),
      text: '',
      spreadId: 'single',
      spreadNumber: 0,
      tariffs: { trial: true, extended: true, standard: true },
      areDetailsNeeded: true,
    });
  };

  const handleSubItemClick = (sectionId: string, itemId: string) => {
    const theme = themes.find((t) => t.name === sectionId);

    if (!theme) return;

    const question = theme.questions.find((q) => q.label === itemId);

    if (!question) return;

    const { label, text, spreadTitle, detailsQuestion, detailsAnswer } =
      question;

    onQuestionChoose({
      ...question,
      label: i18n(label),
      text: i18n(text),
      detailsAnswer: i18n(detailsAnswer ?? ''),
      detailsQuestion: i18n(detailsQuestion ?? ''),
      spreadTitle: i18n(spreadTitle ?? ''),
    });
  };

  const accordionItems: AccordionItem[] = themes.map((theme) => ({
    id: theme.name,
    header: i18n(theme.name),
    items: theme.questions.map((question) => ({
      id: question.label,
      label: i18n(question.label),
      description: i18n(question.text),
      iconRight: <Price cost={question.spreadNumber} />,
    })),
  }));

  return (
    <>
      <Button className={styles.button} onClick={handleOwnQuestionClick}>
        {i18n('My own question')}
      </Button>

      <h3 className={styles.title}>{i18n('Topics')}</h3>

      <Accordion
        className={styles.accordion}
        items={accordionItems}
        onSubItemClick={handleSubItemClick}
      />
    </>
  );
};

export default Themes;
