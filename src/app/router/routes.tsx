import { createBrowserRouter, type RouteObject } from 'react-router';

import MainPage from '@/pages/Main/';
import ReadingPage from '@/pages/Reading';
import DailyCard from '@/pages/DailyCard';

const routes: RouteObject[] = [
  { path: '/', Component: MainPage },
  { path: '/reading', Component: ReadingPage },
  { path: '/daily', Component: DailyCard },
];

export const router = createBrowserRouter(routes);
