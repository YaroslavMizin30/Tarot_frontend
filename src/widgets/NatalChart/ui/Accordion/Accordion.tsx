import { useState, type FC } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import Zodiac from '@/shared/ui/Zodiac';

import { useHighlights } from '@/features/Circle';

import { findPlanets } from '../../lib/bodies';
import { findSign } from '../../lib/signs';
import { findHouse } from '../../lib/houses';
import {
  getNatalAspectKey,
  getNatalAspectType,
  normalizeNatalAspectType,
} from '../../lib/aspects';

import type { AspectType } from '@/entities/Horoscope/types';

import { type AccordionProps, type SectionProps } from './Accordion.props';

import styles from './Accordion.module.css';

const Section = (props: SectionProps) => {
  const {
    isOpened,
    onClick,
    items,
    name,
    className = '',
    onHighLight,
    selectedPlanet,
    onSelectPlanet,
    aspects = [],
    selectedAspectKey,
    onSelectAspect,
  } = props;

  const { i18n } = useLocales();

  const { rootRef, addElement } = useHighlights({
    onHighLight,
    threshold: 0.65,
    onElementVisibility: (isVisible, element) => {
      if (!isVisible || element.getAttribute('data-highlight-item') !== 'true') {
        return;
      }

      onSelectAspect?.(element.getAttribute('data-aspect-key'));
    },
  });

  return (
    <div
      className={`${styles.section} ${isOpened ? styles['section-opened'] : ''} ${className}`}
    >
      <button
        type={'button'}
        className={`${styles.button} ${styles[name]}`}
        aria-expanded={isOpened}
        onClick={onClick}
      >
        <span>{i18n(name)}</span>

        <div
          className={`${styles.chevron} ${isOpened ? styles.up : styles.down}`}
        />
      </button>

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
            const aspectType = tags
              .map(normalizeNatalAspectType)
              .find((type): type is AspectType => Boolean(type));
            const relatedAspect = planets.length > 1
              ? aspects.find((aspect) => {
                const samePlanets =
                  (aspect.p1 === planets[0] && aspect.p2 === planets[1]) ||
                  (aspect.p1 === planets[1] && aspect.p2 === planets[0]);

                return samePlanets && (!aspectType || getNatalAspectType(aspect) === aspectType);
              })
              : undefined;
            const aspectKey = relatedAspect ? getNatalAspectKey(relatedAspect) : null;
            const isSelected = aspectKey
              ? selectedAspectKey === aspectKey
              : Boolean(selectedPlanet && planets.includes(selectedPlanet));

            const handleSelect = () => {
              if (relatedAspect && aspectKey) {
                onSelectPlanet?.(relatedAspect.p1);
                onSelectAspect?.(selectedAspectKey === aspectKey ? null : aspectKey);
              } else if (planets[0]) {
                onSelectPlanet?.(selectedPlanet === planets[0] ? null : planets[0]);
              }
            };

            return (
              <div
                className={`${styles.item} ${isSelected ? styles.selectedItem : ''}`}
                key={title}
                role={planets[0] ? 'button' : undefined}
                tabIndex={planets[0] ? 0 : undefined}
                onClick={handleSelect}
                onKeyDown={(event) => {
                  if (planets[0] && (event.key === 'Enter' || event.key === ' ')) {
                    handleSelect();
                  }
                }}
              >
                <div
                  className={styles.header}
                  ref={addElement}
                  data-highlight-item={'true'}
                  data-aspect-key={aspectKey ?? undefined}
                >
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
  const {
    sections,
    onHighLight,
    selectedPlanet,
    onSelectPlanet,
    aspects,
    selectedAspectKey,
    onSelectAspect,
  } = props;

  const { i18n } = useLocales();

  const [openedItem, setOpenedItem] = useState<string | null>('core');

  const handleItemClick = (value: string) => {
    if (value === openedItem) {
      setOpenedItem(null);
    } else {
      setOpenedItem(value);
    }
  };

  return (
    <div className={styles.accordion}>
      <div className={styles.heading}>
        <span>{i18n('General characteristics')}</span>
        <small>{i18n('Open a topic to explore your chart')}</small>
      </div>

      <Section
        onHighLight={onHighLight}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={onSelectPlanet}
        aspects={aspects}
        selectedAspectKey={selectedAspectKey}
        onSelectAspect={onSelectAspect}
        name={'core'}
        onClick={() => handleItemClick('core')}
        isOpened={openedItem === 'core'}
        items={sections.core_self}
      />

      <Section
        onHighLight={onHighLight}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={onSelectPlanet}
        aspects={aspects}
        selectedAspectKey={selectedAspectKey}
        onSelectAspect={onSelectAspect}
        name={'mind'}
        onClick={() => handleItemClick('mind')}
        isOpened={openedItem === 'mind'}
        items={sections.mind}
      />

      <Section
        onHighLight={onHighLight}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={onSelectPlanet}
        aspects={aspects}
        selectedAspectKey={selectedAspectKey}
        onSelectAspect={onSelectAspect}
        name={'work'}
        onClick={() => handleItemClick('work')}
        isOpened={openedItem === 'work'}
        items={sections.work_path}
      />

      <Section
        onHighLight={onHighLight}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={onSelectPlanet}
        aspects={aspects}
        selectedAspectKey={selectedAspectKey}
        onSelectAspect={onSelectAspect}
        name={'love'}
        onClick={() => handleItemClick('love')}
        isOpened={openedItem === 'love'}
        items={sections.love_relating}
      />

      <Section
        onHighLight={onHighLight}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={onSelectPlanet}
        aspects={aspects}
        selectedAspectKey={selectedAspectKey}
        onSelectAspect={onSelectAspect}
        name={'social'}
        onClick={() => handleItemClick('social')}
        isOpened={openedItem === 'social'}
        items={sections.social_collective}
      />

      <Section
        onHighLight={onHighLight}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={onSelectPlanet}
        aspects={aspects}
        selectedAspectKey={selectedAspectKey}
        onSelectAspect={onSelectAspect}
        name={'karmic'}
        onClick={() => handleItemClick('karmic')}
        isOpened={openedItem === 'karmic'}
        items={sections.karmic_healing}
      />
    </div>
  );
};

export default Accordion;
