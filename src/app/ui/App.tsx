import './App.css';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';

import router from '../router';
import store from '../store';

export function App() {
  window?.Telegram?.WebApp?.setBackgroundColor('#ffdb88');
  window?.Telegram?.WebApp?.setBottomBarColor('#001d73');
  window?.Telegram?.WebApp?.setHeaderColor('#001d73');

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
