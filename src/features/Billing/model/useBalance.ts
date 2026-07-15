import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { ensureSupabase, updateRaw } from '@/shared/api/supabase';
import { queryKeys } from '@/shared/api/queryKeys';
import { useUser } from '@/entities/User';

import type { User } from '@/entities/User';

export interface UseBalanceResult {
  /** Текущий баланс пользователя в пентаклях */
  balance: number;
  /** Признак того, что баланс сейчас обновляется */
  isUpdating: boolean;
  /**
   * Пополняет баланс пользователя на указанное количество пентаклей.
   * Используется для Telegram Stars — где пополнение происходит на клиенте,
   * т.к. мы точно знаем, что инвойс был оплачен.
   */
  topUp: (amount: number) => Promise<boolean>;
  /**
   * Списывает стоимость платного действия с баланса пользователя.
   * Возвращает false, если у пользователя недостаточно пентаклей или
   * пользователь не авторизован.
   */
  charge: (cost: number) => Promise<boolean>;
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

interface BalanceDeltaParams {
  id: string;
  nextBalance: number;
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
  };
}

const persistBalance = async ({ id, nextBalance }: BalanceDeltaParams) => {
  await ensureSupabase();

  const updated = await updateRaw<User>(
    'users',
    { balance: nextBalance },
    {
      key: 'id',
      value: id,
    },
  );

  return Boolean(updated);
};

/**
 * Хук для работы с балансом пользователя (пентакли).
 *
 * Инкапсулирует логику обновления поля `balance`:
 * - при пополнении через Telegram Stars — `topUp(amount)` (атомарно на клиенте);
 * - при пополнении через СБП — `refresh()` (бэкенд сам обновит баланс);
 * - при каждом платном действии — `charge(cost)` после проверки `requireBalance`;
 * - при нехватке баланса — `requireBalance` редиректит на /billing с уведомлением.
 *
 * Все мутации синхронизируют кэш React Query через `queryKeys.user.all`,
 * чтобы подписчики `useUser` видели актуальный баланс без перезагрузки.
 */
export const useBalance = (): UseBalanceResult => {
  const { user, refetchUser } = useUser();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const balanceMutation = useMutation({
    mutationFn: persistBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });

  const topUp = useCallback(
    async (amount: number): Promise<boolean> => {
      if (!user || amount <= 0) {
        return false;
      }

      const nextBalance = (user.balance ?? 0) + amount;

      try {
        return await balanceMutation.mutateAsync({
          id: String(user.id),
          nextBalance,
        });
      } catch {
        return false;
      }
    },
    [user, balanceMutation],
  );

  const charge = useCallback(
    async (cost: number): Promise<boolean> => {
      if (!user || cost <= 0) {
        return false;
      }

      const currentBalance = user.balance ?? 0;

      if (currentBalance < cost) {
        return false;
      }

      const nextBalance = currentBalance - cost;

      try {
        return await balanceMutation.mutateAsync({
          id: String(user.id),
          nextBalance,
        });
      } catch {
        return false;
      }
    },
    [user, balanceMutation],
  );

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
    isUpdating: balanceMutation.isPending,
    topUp,
    charge,
    refresh,
    requireBalance,
  };
};
