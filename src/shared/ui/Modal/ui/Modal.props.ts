import { type ReactNode } from 'react';

export interface ModalProps {
  /**
   * Is modal open
   */
  isOpen: boolean;
  /**
   * Callback for close modal
   */
  onClose: () => void;
  /**
   * Modal content
   */
  children: ReactNode;
  /**
   * Custom class
   */
  className?: string;
  /**
   * Custom class for modal content
   */
  contentClassName?: string;
  /**
   * Flag if modal can be closed
   */
  isClosable?: boolean;
}
