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
          },
          className,
        )}
        disabled={disabled || isLoading}
        {...rest}
      >
        <span className={cx({ 'btn__content--loading': isLoading })}>
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
