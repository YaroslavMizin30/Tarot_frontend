import {
  useEffect,
  useRef,
  useState,
  type FC,
  type ChangeEvent,
  type FocusEvent,
} from 'react';

import TextArea from '@/shared/ui/TextArea/TextArea';
import useLocales from '@/shared/hooks/useLocales';

import type { QuestionInputProps } from './QuestionInput.props';

import styles from './QuestionInput.module.css';

const QuestionInput: FC<QuestionInputProps> = (props) => {
  const { spread, onQuestionInput } = props;

  const { i18n } = useLocales();

  const { details } = spread;

  const [error, setError] = useState<string | null>(null);

  const handleQuestionInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    onQuestionInput(value);
  };

  const handleInputFocus = () => {
    setError(null);
  };

  const handleInputBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (!value) {
      setError(i18n('Details are required'));
    }
  };

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{details}</h3>

      <TextArea
        ref={ref}
        name={'question'}
        onChange={handleQuestionInput}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        className={styles.input}
        placeholder={i18n('Type here...')}
        errorMessage={error ?? undefined}
      />
    </div>
  );
};

export default QuestionInput;
