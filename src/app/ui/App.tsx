import './App.css';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';

import router from '../router';
import store from '../store';

export function App() {
  window.Telegram?.WebApp?.setHeaderColor?.('#ffdb88');

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
