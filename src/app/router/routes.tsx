import { createBrowserRouter, type RouteObject } from 'react-router';

import Layout from '@/app/ui/Layout';
import MainPage from '@/pages/Main/';

import {
  loadAstrologyPage,
  loadReadingPage,
  loadSettingsPage,
} from './routeLoaders';

const ROUTE_RELOAD_PREFIX = 'tarotopia:route-reload:';

async function loadRouteModule<T>(
  routeKey: string,
  loader: () => Promise<T>,
): Promise<T> {
  const reloadKey = `${ROUTE_RELOAD_PREFIX}${routeKey}`;

  try {
    const routeModule = await loader();

    try {
      window.sessionStorage.removeItem(reloadKey);
    } catch {
      // The route itself is valid even if WebView storage is unavailable.
    }

    return routeModule;
  } catch (error) {
    try {
      if (!window.sessionStorage.getItem(reloadKey)) {
        window.sessionStorage.setItem(reloadKey, '1');
        window.location.reload();

        return await new Promise<T>(() => {
          // The document reload replaces this pending route transition.
        });
      }

      window.sessionStorage.removeItem(reloadKey);
    } catch {
      // Storage can be unavailable in a restricted WebView. Keep the original
      // route error instead of risking a reload loop.
    }

    throw error;
  }
}

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
            const { default: ReadingPage } = await loadRouteModule(
              'tarot',
              loadReadingPage,
            );

            return ReadingPage;
          },
        },
      },
      {
        path: '/reading',
        lazy: {
          async Component() {
            const { default: ReadingPage } = await loadRouteModule(
              'reading',
              loadReadingPage,
            );

            return ReadingPage;
          },
        },
      },
      {
        path: '/about',
        lazy: {
          async Component() {
            const { default: AboutPage } = await loadRouteModule(
              'about',
              () => import('@/pages/About'),
            );

            return AboutPage;
          },
        },
      },
      {
        path: '/settings',
        lazy: {
          async Component() {
            const { default: SettingsPage } = await loadRouteModule(
              'settings',
              loadSettingsPage,
            );

            return SettingsPage;
          },
        },
      },
      {
        path: '/about-app',
        lazy: {
          async Component() {
            const { default: AboutAppPage } = await loadRouteModule(
              'about-app',
              () => import('@/pages/AboutApp'),
            );

            return AboutAppPage;
          },
        },
      },
      {
        path: '/history',
        lazy: {
          async Component() {
            const { default: HistoryPage } = await loadRouteModule(
              'history',
              () => import('@/pages/History'),
            );

            return HistoryPage;
          },
        },
      },
      {
        path: '/history/:id',
        lazy: {
          async Component() {
            const { default: SpreadPage } = await loadRouteModule(
              'history-item',
              () => import('@/pages/Spread'),
            );

            return SpreadPage;
          },
        },
      },
      {
        path: '/reg',
        lazy: {
          async Component() {
            const { default: RegisterPage } = await loadRouteModule(
              'registration',
              () => import('@/pages/Registry'),
            );

            return RegisterPage;
          },
        },
      },
      {
        path: '/astrology',
        lazy: {
          async Component() {
            const { default: AstrologyPage } = await loadRouteModule(
              'astrology',
              loadAstrologyPage,
            );

            return AstrologyPage;
          },
        },
      },
      {
        path: '/natal-chart',
        lazy: {
          async Component() {
            const { default: NatalChartPage } =
              await loadRouteModule('natal-chart', () =>
                import('@/pages/NatalChart'),
              );

            return NatalChartPage;
          },
        },
      },
      {
        path: '/transits',
        lazy: {
          async Component() {
            const { default: TransitsPage } =
              await loadRouteModule('transits', () =>
                import('@/pages/Transits'),
              );

            return TransitsPage;
          },
        },
      },
      {
        path: '/horoscopes',
        lazy: {
          async Component() {
            const { default: HoroscopesPage } =
              await loadRouteModule('horoscopes', () =>
                import('@/pages/Horoscopes'),
              );

            return HoroscopesPage;
          },
        },
      },
      {
        path: '/billing',
        lazy: {
          async Component() {
            const { default: BillingPage } = await loadRouteModule(
              'billing',
              () => import('@/pages/Billing'),
            );

            return BillingPage;
          },
        },
      },
      {
        path: '/calendar',
        lazy: {
          async Component() {
            const { default: CalendarPage } = await loadRouteModule(
              'calendar',
              () => import('@/pages/Calendar'),
            );

            return CalendarPage;
          },
        },
      },
      {
        path: '/roulette',
        lazy: {
          async Component() {
            const { default: RoulettePage } = await loadRouteModule(
              'roulette',
              () => import('@/pages/Roulette'),
            );

            return RoulettePage;
          },
        },
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
