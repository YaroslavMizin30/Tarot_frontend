export const checkSubscriptionStatus = (
  expirationDate: string | number | Date,
) => {
  const now = new Date();
  const expDate = new Date(expirationDate);

  // Проверка на невалидную дату
  if (isNaN(expDate.getTime())) {
    return { daysLeft: 0, isExpired: false, isExpiringSoon: false };
  }

  const diffInMs = expDate.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return {
    daysLeft: Math.max(0, Math.ceil(diffInDays)),
    isExpired: diffInMs <= 0,
    isExpiringSoon: diffInDays > 0 && diffInDays <= 3, // Предупреждать за 3 дня до конца
  };
};
