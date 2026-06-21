import { type ReactNode } from 'react';

export interface AccordionSubItem {
  /** Unique identifier for the sub-item */
  id: string;
  /** Label text displayed inside the sub-item Button */
  label: string;
  /** Description text displayed below the sub-item Button */
  description?: string;
  /** Disabled state for the sub-item Button */
  disabled?: boolean;
}

export interface AccordionItem {
  /** Unique identifier for the accordion section */
  id: string;
  /** Content of the header / section opener Button */
  header: ReactNode;
  /**
   * List of sub-items rendered inside the section.
   * Each sub-item follows the List.tsx pattern: Button + description.
   */
  items?: AccordionSubItem[];
  /**
   * Custom content rendered inside the section.
   * If both `items` and `content` are provided, `items` takes precedence.
   */
  content?: ReactNode;
}

export interface AccordionProps {
  /** Array of accordion sections */
  items: AccordionItem[];
  /** Allow multiple sections to be open simultaneously */
  allowMultiple?: boolean;
  /** Initially open section IDs (for uncontrolled mode) */
  defaultOpenIds?: string[];
  /** Controlled open section IDs */
  openIds?: string[];
  /** Callback when open sections change */
  onToggle?: (openIds: string[]) => void;
  /** Callback when a sub-item is clicked */
  onSubItemClick?: (sectionId: string, subItemId: string) => void;
  /** Additional class name */
  className?: string;
}
