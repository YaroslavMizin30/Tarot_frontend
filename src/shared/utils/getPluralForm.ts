export const getPluralForm = (
  number: number,
  forms: [string, string, string],
): string => {
  const n = Math.abs(Math.floor(number)); // Берем модуль и округляем до целого
  const lastTwoDigits = n % 100;
  const lastDigit = n % 10;

  // Исключение для чисел от 11 до 14 (11 дней, 12 дней, 13 дней, 14 дней)
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2];
  }

  // Числа, оканчивающиеся на 1 (кроме 11) -> 1 день, 21 день
  if (lastDigit === 1) {
    return forms[0];
  }

  // Числа, оканчивающиеся на 2, 3, 4 (кроме 12, 13, 14) -> 2 дня, 23 дня
  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1];
  }

  // Все остальные случаи (0, 5-9, 10, 15-20 и т.д.) -> 0 дней, 5 дней, 11 дней
  return forms[2];
};
