import classNames from 'classnames/bind';

import { forwardRef } from 'react';

import { type ButtonProps } from './Button.props';

import styles from './Button.module.css';

const cx = classNames.bind(styles);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      children,
      isLoading = false,
      disabled,
      className = '',
      iconRight = null,
      ...rest
    } = props;

    return (
      <button
        ref={ref}
        className={cx(
          'btn',
          {
            'btn--loading': isLoading,
            'btn--disabled': disabled,
            'btn__with-icon': iconRight,
          },
          className,
        )}
        disabled={isLoading}
        style={{ pointerEvents: disabled ? 'none' : 'all' }}
        {...rest}
      >
        {iconRight && <div></div>}

        <span
          className={cx('btn__content', {
            'btn__content--loading': isLoading,
            'btn__content--with-icon': iconRight,
          })}
        >
          {children}
        </span>

        {iconRight && <div className={styles['icon-right']}>{iconRight}</div>}
      </button>
    );
  },
);

Button.displayName = 'Button';
