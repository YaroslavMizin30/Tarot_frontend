import { useNavigate } from 'react-router';

import type { User } from '@/entities/User';
import useLocales from '@/shared/hooks/useLocales';
import Pentacle from '@/shared/ui/Pentacle';

import styles from './ProfileWallet.module.css';

interface ProfileWalletProps {
  user: User;
}

export const ProfileWallet = ({ user }: ProfileWalletProps) => {
  const navigate = useNavigate();
  const { i18n } = useLocales();
  const purchasedBalance = Number(user.balance ?? 0);
  const bonusBalance = Number(user.bonusBalance ?? 0);
  const totalBalance = purchasedBalance + bonusBalance;

  return (
    <section className={styles.container} aria-label={i18n('Wallet')}>
      <div className={styles.total}>
        <span>{i18n('Wallet')}</span>
        <strong>
          {totalBalance}
          <Pentacle className={styles.pentacle} />
        </strong>
      </div>

      <dl className={styles.breakdown}>
        <div>
          <dt>{i18n('Purchased')}</dt>
          <dd>{purchasedBalance}</dd>
        </div>
        <div>
          <dt>{i18n('Bonus')}</dt>
          <dd>{bonusBalance}</dd>
        </div>
      </dl>

      <button
        className={styles.topUp}
        onClick={() => navigate('/billing')}
        type={'button'}
      >
        <span>{i18n('Top up')}</span>
        <span aria-hidden={true}>→</span>
      </button>
    </section>
  );
};

export default ProfileWallet;
