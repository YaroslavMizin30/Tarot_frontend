import { type FC } from 'react';

import type { ModalProps } from './Modal.props';

import styles from './Modal.module.css';

export const Modal: FC<ModalProps> = (props) => {
  const {
    className = '',
    contentClassName = '',
    children,
    isOpen,
    onClose,
  } = props;

  return (
    <div
      className={styles.overlay}
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div
        className={`${styles.modal} ${className}`}
        style={{ display: isOpen ? 'flex' : 'none' }}
      >
        <div className={styles['icon-wrapper']} onClick={onClose}>
          <div className={styles['close-icon']}></div>
        </div>

        <div className={`${styles.content} ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
