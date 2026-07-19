import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useUser } from '@/entities/User';

export interface UseBalanceResult {
  /** Текущий баланс пользователя в пентаклях */
  balance: number;
  /** Зарезервировано для серверных денежных операций. */
  isUpdating: boolean;
  /**
   * Принудительно перезагружает пользователя из БД.
   * Используется после СБП-оплаты, потому что баланс обновляется на бэкенде,
   * и нам нужно подтянуть актуальное значение.
   */
  refresh: () => Promise<void>;
  /**
   * Проверяет, достаточно ли у пользователя пентаклей для `cost`.
   * Если недостаточно — перенаправляет на страницу биллинга с сообщением,
   * что для действия требуется пополнить баланс.
   *
   * Возвращает `true`, если средств хватает (можно продолжать),
   * `false` — если средств недостаточно (пользователь уже на биллинге).
   */
  requireBalance: (cost: number) => boolean;
}

/**
 * Ключ, по которому страница биллинга читает сообщение о причине редиректа.
 */
export const BILLING_REDIRECT_STATE_KEY = 'insufficientBalance';

export interface BillingRedirectState {
  [BILLING_REDIRECT_STATE_KEY]: {
    /** Стоимость действия, на которое не хватило пентаклей */
    required: number;
    /** Текущий (недостаточный) баланс пользователя */
    current: number;
    /** Серверный черновик действия, которое нужно продолжить после оплаты */
    draftId?: string;
    /** Маршрут возврата после успешного пополнения */
    returnTo?: string;
  };
}

/**
 * Хук для работы с балансом пользователя (пентакли).
 *
 * Клиент только читает и обновляет кэш баланса. Любые начисления и списания
 * выполняются серверными функциями и транзакциями:
 * - после оплаты вызывается `refresh()`;
 * - перед платным действием `requireBalance()` даёт раннюю UX-проверку;
 * - при нехватке баланса — `requireBalance` редиректит на /billing с уведомлением.
 */
export const useBalance = (): UseBalanceResult => {
  const { user, refetchUser } = useUser();

  const navigate = useNavigate();

  const refresh = useCallback(async (): Promise<void> => {
    if (!refetchUser) {
      return;
    }

    await refetchUser();
  }, [refetchUser]);

  const requireBalance = useCallback(
    (cost: number): boolean => {
      if (!user) {
        return false;
      }

      const currentBalance = user.balance ?? 0;

      if (currentBalance >= cost) {
        return true;
      }

      // Не хватает пентаклей → редиректим на биллинг с сообщением.
      const state: BillingRedirectState = {
        [BILLING_REDIRECT_STATE_KEY]: {
          required: cost,
          current: currentBalance,
        },
      };

      navigate('/billing', { state });

      return false;
    },
    [user, navigate],
  );

  return {
    balance: user?.balance ?? 0,
    isUpdating: false,
    refresh,
    requireBalance,
  };
};
