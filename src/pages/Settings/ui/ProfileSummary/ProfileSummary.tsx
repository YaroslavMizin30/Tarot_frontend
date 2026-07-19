import type { User } from '@/entities/User';
import useLocales from '@/shared/hooks/useLocales';
import Zodiac from '@/shared/ui/Zodiac';

import styles from './ProfileSummary.module.css';

interface ProfileSummaryProps {
  user: User;
}

const hasKnownBirthTime = (birthTime?: string) =>
  Boolean(birthTime && !birthTime.includes('undefined'));

export const ProfileSummary = ({ user }: ProfileSummaryProps) => {
  const { i18n } = useLocales();
  const titleId = `profile-${user.id}-title`;

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <div className={styles.sign} aria-hidden={true}>
        <Zodiac sign={user.sign} type={'big'} />
      </div>

      <div className={styles.content}>
        <div className={styles.identity}>
          <span className={styles.eyebrow}>{i18n('Profile')}</span>
          <h1 id={titleId}>{user.userName || i18n('Profile')}</h1>
          <span className={styles.zodiacName}>{i18n(user.sign)}</span>
        </div>

        <dl className={styles.details}>
          <div>
            <dt>{i18n('Birth date')}</dt>
            <dd>{user.birthDate || '—'}</dd>
          </div>

          <div>
            <dt>{i18n('Birth time')}</dt>
            <dd>
              {hasKnownBirthTime(user.birthTime)
                ? user.birthTime
                : i18n('Unknown time')}
            </dd>
          </div>

          <div className={styles.place}>
            <dt>{i18n('Birth place')}</dt>
            <dd>{user.birthPlace || '—'}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default ProfileSummary;
