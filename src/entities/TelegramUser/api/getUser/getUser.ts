export const getTelegramUser = () => {
  const { DEV } = import.meta.env;

  if (DEV) {
    const id = Number(import.meta.env.VITE_ADMIN_ID);
    return Number.isSafeInteger(id) && id > 0 ? { id } : null;
  }

  if (!window.Telegram) {
    return null;
  }

  const initData = window.Telegram.WebApp.initDataUnsafe;

  const user = initData.user;

  return user;
};
