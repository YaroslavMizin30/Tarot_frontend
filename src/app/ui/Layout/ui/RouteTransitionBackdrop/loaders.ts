import { getPageAttachment } from '../../config/pages';

export type RouteScene = 'main' | 'tarot' | 'astrology' | 'default';

export const loadDaySky = () => import('@/widgets/DaySky');
export const loadStarsComposition = () => import('../StarsComposition');
export const loadTorchComposition = () =>
  import('../TorchComposition/TorchComposition');

export const getRouteScene = (pathname: string): RouteScene => {
  if (pathname === '/') return 'main';
  if (getPageAttachment('tarot', pathname)) return 'tarot';
  if (getPageAttachment('astrology', pathname)) return 'astrology';
  return 'default';
};

export const preloadBackdropForPath = (pathname: string) => {
  const scene = getRouteScene(pathname);

  if (scene === 'main') return loadDaySky();
  if (scene === 'tarot') return loadTorchComposition();
  if (scene === 'astrology') return loadStarsComposition();
  return Promise.resolve();
};
