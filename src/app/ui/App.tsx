import './App.css';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';

import router from '../router';
import store from '../store';

import useTelegram from '@/shared/hooks/useTelegram';

export function App() {
  const { prepareApp, isMobile, hideHeaderButtons, expandApp } = useTelegram();

  prepareApp();

  if (isMobile) {
    hideHeaderButtons();
    expandApp();
  }

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
