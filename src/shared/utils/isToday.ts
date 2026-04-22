export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const actionDate = new Date(date);

  return (
    actionDate.getDate() === today.getDate() &&
    actionDate.getMonth() === today.getMonth() &&
    actionDate.getFullYear() === today.getFullYear()
  );
};
