import { backend } from '../../backend';

export const updateRaw = async <T>(
  table: string,
  columns: Record<string, unknown>,
  equal: {
    key: string;
    value: string | number;
  },
): Promise<T[] | null> => {
  try {
    return await backend.update<T>(table, columns, [{
      column: equal.key,
      value: equal.value,
    }]);
  } catch {
    return null;
  }
};
