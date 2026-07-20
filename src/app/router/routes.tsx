import { createBrowserRouter, type RouteObject } from 'react-router';

import Layout from '@/app/ui/Layout';
import MainPage from '@/pages/Main/';

import {
  loadAstrologyPage,
  loadReadingPage,
  loadSettingsPage,
} from './routeLoaders';

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { path: '/', Component: MainPage },
      {
        path: '/tarot',
        lazy: {
          async Component() {
            const { default: ReadingPage } = await loadReadingPage();

            return ReadingPage;
          },
        },
      },
      {
        path: '/reading',
        lazy: {
          async Component() {
            const { default: ReadingPage } = await loadReadingPage();

            return ReadingPage;
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
            const { default: SettingsPage } = await loadSettingsPage();

            return SettingsPage;
          },
        },
      },
      {
        path: '/about-app',
        lazy: {
          async Component() {
            const { default: AboutAppPage } = await import('@/pages/AboutApp');

            return AboutAppPage;
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
            const { default: AstrologyPage } = await loadAstrologyPage();

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
        path: '/transits',
        lazy: {
          async Component() {
            const { default: TransitsPage } =
              await import('@/pages/Transits');

            return TransitsPage;
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
            const { default: BillingPage } = await import('@/pages/Billing');

            return BillingPage;
          },
        },
      },
      {
        path: '/calendar',
        lazy: {
          async Component() {
            const { default: CalendarPage } = await import('@/pages/Calendar');

            return CalendarPage;
          },
        },
      },
      {
        path: '/roulette',
        lazy: {
          async Component() {
            const { default: RoulettePage } = await import('@/pages/Roulette');

            return RoulettePage;
          },
        },
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
