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
            const { default: BillingPage } = await import('@/pages/Billing');

            return BillingPage;
          },
        },
      },
      {
        path: '/forecast',
        lazy: {
          async Component() {
            const { default: ForecastPage } = await import('@/pages/Forecast');

            return ForecastPage;
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
