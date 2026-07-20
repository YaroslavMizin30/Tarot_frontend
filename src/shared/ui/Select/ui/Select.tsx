import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/select';
import TRANSLATIONS_RU from '@/shared/locales/ru/select';

import type { SelectProps, SelectOption } from './Select.props';

import styles from './Select.module.css';

export const Select = ({
  options,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  hasSearch = false,
  emptyPhrase,
  error,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [opensUpward, setOpensUpward] = useState(false);
  const [optionsMaxHeight, setOptionsMaxHeight] = useState(180);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Фильтрация опций по поиску
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { i18n, addTranslations, locale } = useLocales();

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [addTranslations, locale]);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen) {
        if (event.key === 'Escape') {
          setIsOpen(false);
          setSearchQuery('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !selectRef.current) return;

    const updateDropdownPlacement = () => {
      const bounds = selectRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const viewportHeight = Math.min(
        window.innerHeight,
        window.Telegram?.WebApp?.viewportStableHeight || window.innerHeight,
      );
      const edgeGap = 12;
      const availableBelow = viewportHeight - bounds.bottom - edgeGap;
      const availableAbove = bounds.top - edgeGap;
      const shouldOpenUpward =
        availableBelow < 200 && availableAbove > availableBelow;
      const availableHeight = shouldOpenUpward
        ? availableAbove
        : availableBelow;
      const searchHeight = options.length > 5 && hasSearch ? 50 : 0;

      setOpensUpward(shouldOpenUpward);
      setOptionsMaxHeight(
        Math.max(96, Math.min(180, availableHeight - searchHeight)),
      );
    };

    updateDropdownPlacement();
    window.addEventListener('resize', updateDropdownPlacement);

    return () => {
      window.removeEventListener('resize', updateDropdownPlacement);
    };
  }, [hasSearch, isOpen, options.length]);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const selectClasses = [
    styles['custom-select'],
    disabled ? styles['custom-select--disabled'] : '',
    error ? styles['custom-select--error'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={selectClasses} ref={selectRef}>
      <button
        type={'button'}
        className={`${styles['custom-select__trigger']} ${
          isOpen
            ? styles[
              opensUpward
                ? 'custom-select__trigger--open-top'
                : 'custom-select__trigger--open'
            ]
            : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup={'listbox'}
        aria-expanded={isOpen}
      >
        <div className={styles['custom-select__content']}>
          <span
            className={
              selectedOption
                ? styles['custom-select__value']
                : styles['custom-select__placeholder']
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <span
            className={`${styles['custom-select__arrow']} ${isOpen ? styles['custom-select__arrow--rotated'] : ''}`}
          >
            ▼
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className={`${styles['custom-select__dropdown']} ${
            opensUpward
              ? styles['custom-select__dropdown--top']
              : ''
          }`}
        >
          {/* Поиск */}
          {options.length > 5 && hasSearch && (
            <div className={styles['custom-select__search-container']}>
              <input
                type={'text'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={i18n('Search')}
                className={styles['custom-select__search-input']}
                autoFocus
              />
            </div>
          )}

          {/* Список опций */}
          <ul
            className={`${styles['custom-select__options']} custom-scrollbar`}
            style={{ maxHeight: `${optionsMaxHeight}px` }}
            role={'listbox'}
            aria-label={'Select options'}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`${styles['custom-select__option']} ${value === option.value ? styles['custom-select__option--selected'] : ''}`}
                  onClick={() => handleSelect(option)}
                  role={'option'}
                  aria-selected={value === option.value}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className={styles['custom-select__no-results']}>
                {emptyPhrase ?? i18n('Nothing was found')}
              </li>
            )}
          </ul>
        </div>
      )}

      {error && <div className={styles['custom-select__error']}>{error}</div>}
    </div>
  );
};
