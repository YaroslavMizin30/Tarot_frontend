import './App.css';

import { Provider } from 'react-redux';

import ReadingPage from '@/pages/Reading';

import Layout from './Layout/Layout';

import store from '../store';

export function App() {
  return (
    <Layout>
      <Provider store={store}>
        <ReadingPage />
      </Provider>
    </Layout>
  );
}
