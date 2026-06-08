export const getTelegramUser = () => {
  const { DEV } = import.meta.env;

  if (DEV) {
    return { id: import.meta.env.VITE_ADMIN_ID };
  }

  if (!window.Telegram) {
    return null;
  }

  const initData = window.Telegram.WebApp.initDataUnsafe;

  const user = initData.user;

  return user;
};
