import './App.css';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';

import { initSupabase } from '@/shared/api/supabase';

import router from '../router';
import store from '../store';

export function App() {
  initSupabase();

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
