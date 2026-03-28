import type { ReactNode } from "react";

export interface TextContainerProps {
  /**
   * Text to be displayed in the container
   */
  paragraphs: string[];
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Maximal height of the container
   */
  maxHeight: number;
  /**
   * The measure of max height
   */
  maxHeightMeasure: 'px' | '%';
  /**
   * Title of the container
   */
  title?: string;
  /**
   * Children
   */
  children: ReactNode;
}
