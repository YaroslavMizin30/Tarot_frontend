import { createBrowserRouter, type RouteObject } from 'react-router';

import MainPage from '@/pages/Main/';
import ReadingPage from '@/pages/Reading';

const routes: RouteObject[] = [
  { path: '/', Component: MainPage },
  { path: '/reading', Component: ReadingPage },
];

export const router = createBrowserRouter(routes);
