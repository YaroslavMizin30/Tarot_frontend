import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Input className
   */
  className?: string;
  /**
   * Input error message
   */
  errorMessage?: string;
}
