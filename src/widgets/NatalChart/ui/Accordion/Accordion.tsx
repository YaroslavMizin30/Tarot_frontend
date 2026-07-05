import { useState, type FC } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import Zodiac from '@/shared/ui/Zodiac';

import { findPlanets } from '../../lib/bodies';
import { findSign } from '../../lib/signs';

import { type AccordionProps, type SectionProps } from './Accordion.props';

import styles from './Accordion.module.css';

const Section = (props: SectionProps) => {
  const { isOpened, onClick, items, name } = props;

  const { i18n } = useLocales();

  return (
    <div className={styles.section}>
      <div className={`${styles.button} ${styles[name]}`} onClick={onClick}>
        {i18n(name)}
      </div>

      <div
        className={`${styles['items-wrapper']} ${isOpened ? styles['items-wrapper--opened'] : ''}`}
      >
        <div className={`${styles.items} custom-scrollbar`}>
          {items.map((item) => {
            const { title, body, tags } = item;

            const planets = findPlanets(tags);
            const sign = findSign(tags);

            return (
              <div className={styles.item}>
                <div className={styles.header}>
                  {planets?.[0] && (
                    <img
                      width={
                        planets[0] === 'saturn' || planets[0] === 'uranus'
                          ? 40
                          : 20
                      }
                      height={20}
                      style={{ marginRight: '5px' }}
                      src={`/assets/images/horoscope/${planets[0]}.png`}
                    />
                  )}

                  <h4 className={styles.title}>{title}</h4>

                  {sign && (
                    <Zodiac
                      type={'small'}
                      //@ts-expect-error no type
                      sign={sign}
                      className={styles.sign}
                    />
                  )}

                  {planets?.[1] && (
                    <img
                      width={
                        planets[1] === 'saturn' || planets[1] === 'uranus'
                          ? 40
                          : 20
                      }
                      height={20}
                      style={{ marginLeft: '5px' }}
                      src={`/assets/images/horoscope/${planets[1]}.png`}
                    />
                  )}
                </div>

                <span className={styles.text}>{body}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Accordion: FC<AccordionProps> = (props) => {
  const { sections } = props;

  const [openedItem, setOpenedItem] = useState<string | null>(null);

  const handleItemClick = (value: string) => {
    if (value === openedItem) {
      setOpenedItem(null);
    } else {
      setOpenedItem(value);
    }
  };

  return (
    <div className={styles.accordion}>
      <Section
        name={'core'}
        onClick={() => handleItemClick('core')}
        isOpened={openedItem === 'core'}
        items={sections.core_self}
      />

      <Section
        name={'mind'}
        onClick={() => handleItemClick('mind')}
        isOpened={openedItem === 'mind'}
        items={sections.mind}
      />

      <Section
        name={'work'}
        onClick={() => handleItemClick('work')}
        isOpened={openedItem === 'work'}
        items={sections.work_path}
      />

      <Section
        name={'love'}
        onClick={() => handleItemClick('love')}
        isOpened={openedItem === 'love'}
        items={sections.love_relating}
      />

      <Section
        name={'social'}
        onClick={() => handleItemClick('social')}
        isOpened={openedItem === 'social'}
        items={sections.social_collective}
      />

      <Section
        name={'karmic'}
        onClick={() => handleItemClick('karmic')}
        isOpened={openedItem === 'karmic'}
        items={sections.karmic_healing}
      />
    </div>
  );
};

export default Accordion;
