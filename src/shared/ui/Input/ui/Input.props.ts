import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input value
   */
  value: string;
  /**
   * Input placeholder
   */
  placeholder: string;
  /**
   * Input name
   */
  name: string;
  /**
   * Input type
   */
  type: string;
  /**
   * Input className
   */
  className?: string;
  /**
   * Input error message
   */
  errorMessage?: string;
}
