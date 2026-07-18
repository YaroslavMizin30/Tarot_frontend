import Card from '@/entities/TarotCard';

import { CARDS_DESCRIPTION } from '../../config/cards';
import { RULE_SECTIONS } from '../../config/rules';

import Effect from '../Effect/Effect';

import styles from './Rules.module.css';
import useLocales from '@/shared/hooks/useLocales';

export const Rules = () => {
  const { i18n } = useLocales();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{i18n('Rules')}</h2>

      <div className={styles.sections}>
        {RULE_SECTIONS.map(({ title, paragraphs }) => (
          <section className={styles.section} key={title}>
            <h3>{i18n(title)}</h3>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{i18n(paragraph)}</p>
            ))}
          </section>
        ))}
      </div>

      <h3 className={styles.title}>{i18n('What the cards mean')}</h3>
      <div className={styles.rules}>
        {CARDS_DESCRIPTION.map(({ id, prize, effect }) => {
          return (
            <div
              className={`${styles.rule} ${
                effect === 'happy-card' ? styles.major : ''
              }`}
              key={id}
            >
              <Effect
                effect={effect}
                className={`${styles.effect} ${styles[`effect-${effect}`]}`}
              />

              <Card
                className={`${styles.card} ${styles[effect]}`}
                name={id}
                size={'xs'}
                localizedName={i18n(id)}
              />

              <span className={styles.description}>{i18n(prize)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
