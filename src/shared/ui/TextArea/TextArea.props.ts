import type { TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  /**
   * Wrapper className
   */
  wrapperClassName?: string;
}
