import { useState, type MouseEvent } from 'react';

import Button from '@/shared/ui/Button';
import type { SpreadType } from '@/shared/types/spread';

import { type TarotSpreadProps } from './TartotSpread.props';

import Placeholder from './Placeholder/Placeholder';

import { SPREADS, SpreadConfig } from '../config/spreads/spreads';

import styles from './TarotSpread.module.css';
import type { FC } from 'react';

export const TarotSpread: FC<TarotSpreadProps> = (props) => {
  const { onSpreadTypeChange = () => undefined } = props;

  const [spreadType, setSpreadType] = useState<`${SpreadType}`>(SPREADS[0].id);

  const handleSpreadButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    const currentSpreadType = event.currentTarget.id as SpreadType;

    setSpreadType(currentSpreadType);

    onSpreadTypeChange(SpreadConfig[currentSpreadType]);
  };

  return (
    <div className={styles.tarotSpread}>
      <div className={styles.header}>
        {SPREADS.map((item) => {
          const { id, label } = item;

          return (
            <Button
              onClick={handleSpreadButtonClick}
              isActive={spreadType === id}
              id={id}
            >
              {label}
            </Button>
          );
        })}
      </div>

      <div className={styles.cards}>
        {SpreadConfig[spreadType].map((card) => {
          const {
            index,
            title,
            description,
            tooltipPosition,
            tooltipStyle,
            ...style
          } = card;

          return (
            <Placeholder
              key={`${spreadType} ${index}`}
              style={style}
              index={index}
              title={title}
              description={description}
              tooltipPosition={
                tooltipPosition as 'left' | 'right' | 'bottom' | 'top'
              }
              tooltipStyle={tooltipStyle}
            />
          );
        })}
      </div>
    </div>
  );
};
