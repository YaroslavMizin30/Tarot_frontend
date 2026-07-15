const TAROT_PAGES = ['/', '/reading', '/about', '/daily', '/history'];
const SETTING_PAGES = ['/settings', '/about-app'];
const ASTROLOGY_PAGES = [
  '/astrology',
  '/natal-chart',
  '/horoscopes',
  '/forecast',
  '/calendar',
];
const BILLING_PAGES = ['/billing'];
const ROULETTE_PAGES = ['/roulette'];

type Page = 'tarot' | 'profile' | 'astrology' | 'billing' | 'roulette';

export const getPageAttachment = (page: Page, pathname: string) => {
  switch (page) {
    case 'tarot':
      return TAROT_PAGES.includes(pathname) || pathname.includes('/history');
    case 'astrology':
      return ASTROLOGY_PAGES.includes(pathname);
    case 'profile':
      return SETTING_PAGES.includes(pathname);
    case 'billing':
      return BILLING_PAGES.includes(pathname);
    case 'roulette':
      return ROULETTE_PAGES.includes(pathname);
    default:
      return false;
  }
};
