import { createBrowserRouter, type RouteObject } from 'react-router';

import Layout from '@/app/ui/Layout';
import MainPage from '@/pages/Main/';

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { path: '/', Component: MainPage },
      {
        path: '/reading',
        lazy: {
          async Component() {
            const { default: ReadingPage } = await import('@/pages/Reading');

            return ReadingPage;
          },
        },
      },
      {
        path: '/daily',
        lazy: {
          async Component() {
            const { default: DailyCard } = await import('@/pages/DailyCard');

            return DailyCard;
          },
        },
      },
      {
        path: '/about',
        lazy: {
          async Component() {
            const { default: AboutPage } = await import('@/pages/About');

            return AboutPage;
          },
        },
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
