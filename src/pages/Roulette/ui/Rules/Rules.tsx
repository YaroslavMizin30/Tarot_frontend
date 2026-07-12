import TextContainer from '@/shared/ui/TextContainer';

import Card from '@/entities/TarotCard';

import { CARDS_DESCRIPTION } from '../../config/cards';
import { RULES } from '../../config/rules';

import Effect from '../Effect/Effect';

import styles from './Rules.module.css';
import useLocales from '@/shared/hooks/useLocales';

export const Rules = () => {
  const { i18n } = useLocales();

  return (
    <div className={styles.container}>
      <TextContainer
        title={i18n('Rules')}
        paragraphs={RULES}
        maxHeight={180}
        maxHeightMeasure={'px'}
        className={styles.general}
      />

      <h3 className={styles.title}>{i18n('Card effects')}</h3>
      <div className={`${styles.rules} custom-scrollbar`}>
        {CARDS_DESCRIPTION.map(({ id, prize, effect }) => {
          return (
            <div className={`${styles.rule} ${styles[id]}`}>
              <Effect
                effect={effect}
                className={`${styles.effect} ${styles[`effect-${effect}`]}`}
              />

              <Card
                className={`${styles.card} ${styles[effect]}`}
                name={id}
                size={'s'}
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
