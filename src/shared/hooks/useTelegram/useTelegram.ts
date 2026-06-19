export const useTelegram = () => {
  const telegram = window?.Telegram?.WebApp;

  const isMobile =
    telegram?.platform === 'ios' || telegram?.platform === 'android';

  const hideHeaderButtons = () => {
    telegram?.BackButton?.hide();
    telegram?.SettingsButton?.hide();
  };

  const prepareApp = () => {
    telegram?.ready();
  };

  const expandApp = () => {
    telegram?.expand();
  };

  return { isMobile, hideHeaderButtons, prepareApp, expandApp };
};
