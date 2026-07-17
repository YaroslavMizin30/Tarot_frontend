const TODAY_PAGES = ['/', '/roulette'];
const TAROT_PAGES = ['/tarot', '/reading', '/about', '/history'];
const SETTING_PAGES = ['/settings', '/about-app', '/billing'];
const ASTROLOGY_PAGES = [
  '/astrology',
  '/natal-chart',
  '/horoscopes',
  '/calendar',
];
type Page = 'today' | 'tarot' | 'profile' | 'astrology';

export const getPageAttachment = (page: Page, pathname: string) => {
  switch (page) {
    case 'today':
      return TODAY_PAGES.includes(pathname);
    case 'tarot':
      return TAROT_PAGES.includes(pathname) || pathname.includes('/history');
    case 'astrology':
      return ASTROLOGY_PAGES.includes(pathname);
    case 'profile':
      return SETTING_PAGES.includes(pathname);
    default:
      return false;
  }
};
