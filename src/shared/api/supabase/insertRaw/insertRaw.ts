import { backend } from '../../backend';

export const insertRaw = async <T>(
  table: string,
  columns: Record<string, unknown>,
): Promise<T[] | null> => {
  try {
    return await backend.insert<T>(table, columns);
  } catch {
    return null;
  }
};
