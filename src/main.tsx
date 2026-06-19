import { createRoot } from 'react-dom/client';

import './index.css';
import App from '@/app';

document.getElementById('telegram')?.addEventListener('load', () => {
  const telegram = window?.Telegram?.WebApp;

  telegram?.ready();

  if (telegram?.platform === 'ios' || telegram?.platform === 'android') {
    telegram?.SettingsButton?.hide();
    telegram?.expand();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
