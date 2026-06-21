import { type FC, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames/bind';

import Button from '@/shared/ui/Button';

import { type AccordionProps } from './Accordion.props';

import styles from './Accordion.module.css';

const cx = classNames.bind(styles);

const Accordion: FC<AccordionProps> = (props) => {
  const {
    items,
    allowMultiple = false,
    defaultOpenIds = [],
    openIds: controlledOpenIds,
    onToggle,
    onSubItemClick,
    className,
  } = props;

  const [localOpenIds, setLocalOpenIds] = useState<string[]>(defaultOpenIds);

  const isControlled = controlledOpenIds !== undefined;
  const openIds = isControlled ? controlledOpenIds : localOpenIds;

  const openSet = useMemo(() => new Set(openIds), [openIds]);

  const handleToggle = useCallback(
    (id: string) => {
      const next = openSet.has(id)
        ? openIds.filter((oid) => oid !== id)
        : allowMultiple
          ? [...openIds, id]
          : [id];

      if (!isControlled) {
        setLocalOpenIds(next);
      }

      onToggle?.(next);
    },
    [openIds, openSet, allowMultiple, isControlled, onToggle],
  );

  const renderContent = (item: (typeof items)[number]) => {
    // If the item has sub-items, render them using the List.tsx layout pattern
    if (item.items && item.items.length > 0) {
      return (
        <>
          {item.items.map((subItem) => (
            <div className={styles['sub-item']} key={subItem.id}>
              <Button
                className={styles['sub-item__button']}
                onClick={() => {
                  onSubItemClick?.(item.id, subItem.id);
                }}
                disabled={subItem.disabled}
              >
                {subItem.label}
              </Button>

              {subItem.description && (
                <div className={styles['sub-item__description']}>
                  {subItem.description}
                </div>
              )}
            </div>
          ))}
        </>
      );
    }

    // Otherwise render custom content
    if (item.content) {
      return <div className={styles.content}>{item.content}</div>;
    }

    return null;
  };

  return (
    <div className={cx('accordion', className)}>
      {items.map((item) => {
        const isOpen = openSet.has(item.id);

        return (
          <div className={styles.section} key={item.id}>
            <Button
              className={cx('button', { 'button--open': isOpen })}
              onClick={() => {
                handleToggle(item.id);
              }}
            >
              {item.header}

              <div className={cx('chevron', { 'arrow--open': isOpen })}></div>
            </Button>

            <div
              className={cx('content-wrapper', {
                'content-wrapper--open': isOpen,
              })}
            >
              <div className={`${styles['content-inner']} custom-scrollbar`}>
                {renderContent(item)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
