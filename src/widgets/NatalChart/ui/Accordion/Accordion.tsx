import { useState, type FC } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import Zodiac from '@/shared/ui/Zodiac';

import { useHighlights } from '@/features/Circle';

import { findPlanets } from '../../lib/bodies';
import { findSign } from '../../lib/signs';
import { findHouse } from '../../lib/houses';

import { type AccordionProps, type SectionProps } from './Accordion.props';

import styles from './Accordion.module.css';

const Section = (props: SectionProps) => {
  const { isOpened, onClick, items, name, className = '', onHighLight } = props;

  const { i18n } = useLocales();

  const { rootRef, addElement } = useHighlights({ onHighLight });

  return (
    <div
      className={`${styles.section} ${isOpened ? styles['section-opened'] : ''} ${className}`}
    >
      <div className={`${styles.button} ${styles[name]}`} onClick={onClick}>
        {i18n(name)}

        <div
          className={`${styles.chevron} ${isOpened ? styles.up : styles.down}`}
        />
      </div>

      <div
        className={`${styles['items-wrapper']} ${isOpened ? styles['items-wrapper--opened'] : ''}`}
        ref={rootRef}
      >
        <div className={`${styles.items} custom-scrollbar`}>
          {items.map((item) => {
            const { title, body, tags } = item;

            const planets = findPlanets(tags);
            const sign = findSign(tags);
            const house = findHouse(tags);

            return (
              <div className={styles.item} key={title}>
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
                      ref={addElement}
                      data-planet={planets?.[0]}
                    />
                  )}

                  <h4 className={styles.title}>{title}</h4>

                  {sign && (
                    <div ref={addElement} data-zodiac={sign.toLowerCase()}>
                      <Zodiac
                        type={'small'}
                        //@ts-expect-error no type
                        sign={sign}
                        className={styles.sign}
                      />
                    </div>
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
                      ref={addElement}
                      data-planet={planets?.[1]}
                    />
                  )}

                  {house && <div data-house={house} ref={addElement} />}
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
  const { sections, onHighLight } = props;

  const [openedItem, setOpenedItem] = useState<string | null>(null);

  const handleItemClick = (value: string) => {
    if (value === openedItem) {
      setOpenedItem(null);
    } else {
      setOpenedItem(value);
    }
  };

  const isHidden = (item: string) => {
    return Boolean(openedItem) && openedItem !== item;
  };

  return (
    <div className={styles.accordion}>
      <Section
        onHighLight={onHighLight}
        name={'core'}
        onClick={() => handleItemClick('core')}
        isOpened={openedItem === 'core'}
        items={sections.core_self}
        className={isHidden('core') ? styles.hidden : ''}
      />

      <Section
        onHighLight={onHighLight}
        name={'mind'}
        onClick={() => handleItemClick('mind')}
        isOpened={openedItem === 'mind'}
        items={sections.mind}
        className={isHidden('mind') ? styles.hidden : ''}
      />

      <Section
        onHighLight={onHighLight}
        name={'work'}
        onClick={() => handleItemClick('work')}
        isOpened={openedItem === 'work'}
        items={sections.work_path}
        className={isHidden('work') ? styles.hidden : ''}
      />

      <Section
        onHighLight={onHighLight}
        name={'love'}
        onClick={() => handleItemClick('love')}
        isOpened={openedItem === 'love'}
        items={sections.love_relating}
        className={isHidden('love') ? styles.hidden : ''}
      />

      <Section
        onHighLight={onHighLight}
        name={'social'}
        onClick={() => handleItemClick('social')}
        isOpened={openedItem === 'social'}
        items={sections.social_collective}
        className={isHidden('social') ? styles.hidden : ''}
      />

      <Section
        onHighLight={onHighLight}
        name={'karmic'}
        onClick={() => handleItemClick('karmic')}
        isOpened={openedItem === 'karmic'}
        items={sections.karmic_healing}
        className={isHidden('karmic') ? styles.hidden : ''}
      />
    </div>
  );
};

export default Accordion;
