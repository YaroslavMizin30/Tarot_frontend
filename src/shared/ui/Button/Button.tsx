import classNames from 'classnames/bind';

import React, { forwardRef } from 'react';

import { type ButtonProps } from './Button.props';

import styles from './Button.module.css';

const cx = classNames.bind(styles);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      className,
    } = props;

    console.log(styles);

    return (
      <button
        ref={ref}
        className={cx(
          'btn',
          `btn--${variant}`,
          `btn--${size}`,
          {
            'btn--loading': isLoading,
            'btn--full-width': fullWidth,
            'btn--disabled': disabled || isLoading,
          },
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <span className={'btn__spinner'}>⏳</span> : null}
        <span className={cx({ 'btn__content--hidden': isLoading })}>
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
