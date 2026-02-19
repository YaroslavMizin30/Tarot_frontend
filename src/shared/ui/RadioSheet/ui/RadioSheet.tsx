import { useState, type ChangeEvent, type FC, type MouseEvent } from 'react';

import { Tooltip } from '../../Tooltip/ui/Tooltip';

import { type RadioSheetProps } from './RadioSheet.props';

import styles from './RadioSheet.module.css';

export const RadioSheet: FC<RadioSheetProps> = (props) => {
  const { items, value, onChange, title = '', className = '', name } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const [visibleElement, setVisibleElement] = useState('');

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    setVisibleElement(event.currentTarget.id);
  };

  const handleMouseLeave = () => {
    setVisibleElement('');
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.list}>
        {items.map((item) => (
          <div
            className={styles.item}
            id={item.id}
            key={item.id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <label
              htmlFor={item.id}
              className={`${styles.label} ${item.id === value && styles['label-selected']}`}
            />

            <input
              type={'radio'}
              name={name}
              id={item.id}
              value={item.id}
              checked={value === item.id}
              onChange={handleChange}
              className={styles.radio}
            />

            <div className={styles.description}>
              <Tooltip
                content={item.description}
                isVisible={visibleElement === item.id}
              >
                {item.label}
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
