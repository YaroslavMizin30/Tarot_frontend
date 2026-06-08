export const isShortSingleWord = (text: string): boolean => {
  if (!text) return false;

  const trimmed = text.trim();

  // Регулярное выражение:
  // ^      - начало строки
  // \S     - любой непробельный символ (буквы, цифры, знаки, но НЕ пробелы/переносы)
  // {1,12} - от 1 до 12 таких символов подряд
  // $      - конец строки
  return /^\S{1,12}$/.test(trimmed);
};
