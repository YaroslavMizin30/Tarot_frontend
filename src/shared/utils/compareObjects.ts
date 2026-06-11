// Тип для результата сравнения
export interface ComparisonResult<T> {
  isEqual: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  differences: Partial<Record<keyof T, { old: any; new: any }>>;
}

// Вспомогательная функция для глубокого сравнения значений
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDeepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  // Специальная обработка для дат (часто встречаются в аналитике)
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !isDeepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
};

/**
 * Сравнивает два объекта с одинаковыми ключами и возвращает детали изменений.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compareObjects = <T extends Record<string, any>>(
  obj1: T,
  obj2: T,
): ComparisonResult<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const differences: Partial<Record<keyof T, { old: any; new: any }>> = {};
  let isEqual = true;

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      // Простая проверка для примитивов и ссылок
      if (val1 !== val2) {
        // Глубокая проверка для объектов, массивов и дат
        if (!isDeepEqual(val1, val2)) {
          isEqual = false;
          differences[key] = { old: val1, new: val2 };
        }
      }
    }
  }

  return { isEqual, differences };
};
