import { Fragment, type FC, type ReactNode } from 'react';

import useLocales from '@/shared/hooks/useLocales';

import type { TextContainerProps } from './TextContainer.props';

import styles from './TextContainer.module.css';

const renderInlineMarkdown = (value: string): ReactNode[] =>
  value
    .split(/(\*\*.+?\*\*|\*[^*]+?\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
      }

      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    });

const renderMarkdown = (paragraphs: string[], translate: (value: string) => string) => {
  const blocks: ReactNode[] = [];

  for (let index = 0; index < paragraphs.length;) {
    const source = translate(paragraphs[index]).trim();
    const heading = source.match(/^(#{1,3})\s+(.+)$/);
    const unorderedItem = source.match(/^[-*]\s+(.+)$/);
    const orderedItem = source.match(/^\d+[.)]\s+(.+)$/);

    if (!source) {
      index += 1;
      continue;
    }

    if (heading) {
      const Heading = heading[1].length === 1 ? 'h2' : heading[1].length === 2 ? 'h3' : 'h4';
      blocks.push(<Heading key={`heading-${index}`}>{renderInlineMarkdown(heading[2])}</Heading>);
      index += 1;
      continue;
    }

    if (unorderedItem || orderedItem) {
      const isOrdered = Boolean(orderedItem);
      const items: ReactNode[] = [];

      while (index < paragraphs.length) {
        const line = translate(paragraphs[index]).trim();
        const match = isOrdered
          ? line.match(/^\d+[.)]\s+(.+)$/)
          : line.match(/^[-*]\s+(.+)$/);
        if (!match) break;
        items.push(<li key={`item-${index}`}>{renderInlineMarkdown(match[1])}</li>);
        index += 1;
      }

      const List = isOrdered ? 'ol' : 'ul';
      blocks.push(<List key={`list-${index}`}>{items}</List>);
      continue;
    }

    blocks.push(<p key={`paragraph-${index}`}>{renderInlineMarkdown(source)}</p>);
    index += 1;
  }

  return blocks;
};

export const TextContainer: FC<TextContainerProps> = (props) => {
  const {
    className = '',
    paragraphs,
    maxHeight,
    maxHeightMeasure,
    title,
    children,
    format = 'plain',
  } = props;

  const { i18n } = useLocales();

  return (
    <div
      className={styles.container}
      style={{ maxHeight: `${maxHeight}${maxHeightMeasure}` }}
    >
      {title && <h3 className={styles.title}>{i18n(title)}</h3>}

      <div className={`${styles.text} custom-scrollbar ${className}`}>
        {format === 'markdown'
          ? renderMarkdown(paragraphs, i18n)
          : paragraphs.map((paragraph, index) => (
            <span key={paragraph || index}>{i18n(paragraph)}</span>
          ))}
      </div>

      {children}
    </div>
  );
};
