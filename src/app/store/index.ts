export { store as default, type RootState, type AppDispatch } from './store';

export { useAppDispatch, useAppSelector } from './hooks';

export {
  preloadTranslations,
  addPreloadedLocation,
  changeLocale,
} from './slices/locales';

export { setSpread } from './slices/spread';

export { setUser } from './slices/user';
