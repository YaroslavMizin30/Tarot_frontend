import { type ChangeEvent, type FC } from 'react';

import { type RadioSheetProps } from './RadioSheet.props';

import styles from './RadioSheet.module.css';

export const RadioSheet: FC<RadioSheetProps> = (props) => {
  const { items, value, onChange, title = '', className = '', name } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.item}>
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
              <span className={styles['label-text']}>
                <b>{item.label}</b>
              </span>

              {item.description && <span>{item.description}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
