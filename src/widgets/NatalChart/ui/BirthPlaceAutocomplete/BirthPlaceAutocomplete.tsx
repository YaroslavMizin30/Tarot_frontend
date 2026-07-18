import { useEffect, useRef, useState } from 'react';

import Input from '@/shared/ui/Input';
import useLocales from '@/shared/hooks/useLocales';

import {
  searchBirthPlaces,
  type BirthPlaceSuggestion,
} from '../../api/searchBirthPlaces';

import styles from './BirthPlaceAutocomplete.module.css';

interface BirthPlaceAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: BirthPlaceSuggestion) => void;
}

export const BirthPlaceAutocomplete = (
  props: BirthPlaceAutocompleteProps,
) => {
  const { value, onChange, onSelect } = props;
  const { i18n, locale } = useLocales();
  const rootRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<BirthPlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const query = value.trim();

    if (query.length < 3 || query === selectedValue) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setRequestFailed(false);

      try {
        const places = await searchBirthPlaces({
          query,
          locale,
          signal: controller.signal,
        });

        setSuggestions(places);
        setIsOpen(true);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setRequestFailed(true);
          setSuggestions([]);
          setIsOpen(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [locale, selectedValue, value]);

  const handleSelect = (place: BirthPlaceSuggestion) => {
    setSelectedValue(place.city);
    setSuggestions([]);
    setIsOpen(false);
    onSelect(place);
  };

  return (
    <div className={styles.autocomplete} ref={rootRef}>
      <Input
        type={'text'}
        name={'city'}
        value={value}
        autoComplete={'off'}
        placeholder={i18n('Start typing a city')}
        aria-autocomplete={'list'}
        aria-expanded={isOpen}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        onChange={(event) => {
          setSelectedValue('');
          onChange(event.currentTarget.value);
        }}
      />

      {isLoading && <span className={styles.status}>{i18n('Searching')}…</span>}

      {isOpen && !isLoading && (
        <div className={styles.dropdown} role={'listbox'}>
          {suggestions.map((place) => (
            <button
              type={'button'}
              role={'option'}
              className={styles.option}
              key={place.id}
              onClick={() => handleSelect(place)}
            >
              <strong>{place.city}</strong>
              <span>{[place.state, place.country].filter(Boolean).join(', ')}</span>
            </button>
          ))}

          {suggestions.length === 0 && (
            <p className={styles.message}>
              {i18n(
                requestFailed
                  ? 'City search is unavailable, enter it manually'
                  : 'No cities found, you can enter it manually',
              )}
            </p>
          )}
        </div>
      )}

      <small className={styles.attribution}>
        {i18n('City search data')}: © OpenStreetMap contributors
      </small>
    </div>
  );
};

export default BirthPlaceAutocomplete;
