import { type FC } from 'react';

import type { ModalProps } from './Modal.props';

import styles from './Modal.module.css';

export const Modal: FC<ModalProps> = (props) => {
  const {
    className = '',
    contentClassName = '',
    overlayClassName = '',
    children,
    isOpen,
    onClose,
    isClosable = true,
  } = props;

  return (
    <div
      className={`${styles.overlay} ${overlayClassName}`}
      style={{ display: isOpen ? 'flex' : 'none' }}
      role={'presentation'}
    >
      <div
        className={`${styles.modal} ${className}`}
        style={{ display: isOpen ? 'flex' : 'none' }}
        role={'dialog'}
        aria-modal={'true'}
      >
        {isClosable && (
          <button
            type={'button'}
            className={styles['icon-wrapper']}
            onClick={onClose}
            aria-label={'Close'}
          >
            <div className={styles['close-icon']}></div>
          </button>
        )}

        <div className={`${styles.content} ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
