export const loadReadingPage = () => import('@/pages/Reading');
export const loadSettingsPage = () => import('@/pages/Settings');
export const loadAstrologyPage = () => import('@/pages/Astrology');

export const preloadMainPage = () =>
  Promise.all([
    import('@/widgets/DailyCard'),
    import('@/widgets/DailyGuidance'),
    import('@/widgets/DailyReflection'),
  ]).then(() => undefined);

export const preloadPrimaryRoute = (pathname: string) => {
  if (pathname === '/') return preloadMainPage();
  if (pathname === '/tarot') return loadReadingPage();
  if (pathname === '/astrology') return loadAstrologyPage();
  if (pathname === '/settings') return loadSettingsPage();

  return Promise.resolve();
};
