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
      {
        path: '/settings',
        lazy: {
          async Component() {
            const { default: SettingsPage } = await import('@/pages/Settings');

            return SettingsPage;
          },
        },
      },
      {
        path: '/history',
        lazy: {
          async Component() {
            const { default: HistoryPage } = await import('@/pages/History');

            return HistoryPage;
          },
        },
      },
      {
        path: '/history/:id',
        lazy: {
          async Component() {
            const { default: SpreadPage } = await import('@/pages/Spread');

            return SpreadPage;
          },
        },
      },
      {
        path: '/reg',
        lazy: {
          async Component() {
            const { default: RegisterPage } = await import('@/pages/Registry');

            return RegisterPage;
          },
        },
      },
      {
        path: '/astrology',
        lazy: {
          async Component() {
            const { default: AstrologyPage } =
              await import('@/pages/Astrology');

            return AstrologyPage;
          },
        },
      },
      {
        path: '/natal-chart',
        lazy: {
          async Component() {
            const { default: NatalChartPage } =
              await import('@/pages/NatalChart');

            return NatalChartPage;
          },
        },
      },
      {
        path: '/horoscopes',
        lazy: {
          async Component() {
            const { default: HoroscopesPage } =
              await import('@/pages/Horoscopes');

            return HoroscopesPage;
          },
        },
      },
      {
        path: '/billing',
        lazy: {
          async Component() {
            const { default: BillingPage } =
              await import('@/pages/Billing');

            return BillingPage;
          },
        },
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
