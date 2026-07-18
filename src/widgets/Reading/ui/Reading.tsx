import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import Questions from '@/features/Questions';
import TarotSpread from '@/features/TarotSpread';
import { BILLING_REDIRECT_STATE_KEY } from '@/features/Billing/model/useBalance';

import {
  resumeSpreadDraft,
  type SpreadParams,
} from '@/entities/Spread';
import Spinner from '@/shared/ui/Spinner';
import Error from '@/shared/ui/Error';
import useLocales from '@/shared/hooks/useLocales';

import {
  setSpread,
  useAppDispatch,
  useAppSelector,
  type RootState,
} from '@/app/store';

import { Step } from '../config/steps';
import styles from './Reading.module.css';

const FLOW_LABELS = ['Question', 'Setup', 'Cards'] as const;

export const Reading = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { i18n } = useLocales();

  const spread = useAppSelector((state: RootState) => state.spread.value);
  const draftId = searchParams.get('draft');

  const [step, setStep] = useState<`${Step}`>('question');
  const [flowStep, setFlowStep] = useState(0);
  const [isResuming, setIsResuming] = useState(Boolean(draftId));
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeAttempt, setResumeAttempt] = useState(0);
  const resumedDraftRef = useRef<string | null>(null);

  const handleSpreadSelect = (params: SpreadParams) => {
    dispatch(setSpread(params));

    setStep('reading');
    setFlowStep(2);
  };

  useEffect(() => {
    if (!draftId || resumedDraftRef.current === draftId) return;

    resumedDraftRef.current = draftId;

    resumeSpreadDraft(draftId)
      .then((result) => {
        if (result.status === 'insufficient_balance') {
          navigate('/billing', {
            replace: true,
            state: {
              [BILLING_REDIRECT_STATE_KEY]: {
                current: result.current,
                draftId: result.draftId,
                required: result.required,
                returnTo: `/tarot?draft=${result.draftId}`,
              },
            },
          });
          return;
        }

        dispatch(
          setSpread({
            ...result.spread,
            spreadId: result.draftId,
          }),
        );
        setStep('reading');
        setFlowStep(2);
        navigate('/tarot', { replace: true });
      })
      .catch(() => {
        setResumeError(i18n('Unable to resume spread'));
      })
      .finally(() => setIsResuming(false));
  }, [dispatch, draftId, i18n, navigate, resumeAttempt]);

  if (isResuming) return <Spinner size={'l'} />;

  if (resumeError) {
    return (
      <Error
        error={resumeError}
        onRetryButtonClick={() => {
          resumedDraftRef.current = null;
          setIsResuming(true);
          setResumeError(null);
          setResumeAttempt((attempt) => attempt + 1);
        }}
      />
    );
  }

  return (
    <div className={styles.reading}>
      <div aria-label={i18n('Spread progress')} className={styles.progress}>
        {FLOW_LABELS.map((label, index) => (
          <span
            aria-current={index === flowStep ? 'step' : undefined}
            className={`${styles.step} ${index < flowStep ? styles.complete : ''} ${index === flowStep ? styles.current : ''}`}
            key={label}
          >
            {i18n(label)}
          </span>
        ))}
      </div>

      <div className={styles.content}>
        {step === 'question' ? (
          <Questions
            onSpreadSelect={handleSpreadSelect}
            onStepChange={(currentStep) =>
              setFlowStep(currentStep === 'theme' ? 0 : 1)
            }
          />
        ) : (
          <TarotSpread spread={spread} />
        )}
      </div>
    </div>
  );
};

export default Reading;
