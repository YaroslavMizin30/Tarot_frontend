export const getTelegramUser = () => {
  if (!window.Telegram) {
    return null;
  }

  const initData = window.Telegram.WebApp.initDataUnsafe;

  const user = initData.user;

  return user || {id: 681641883};
};
