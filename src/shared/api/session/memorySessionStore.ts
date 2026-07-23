import type { ApplicationSession, SessionStore } from './types';

const copySession = (session: ApplicationSession): ApplicationSession => ({
  ...session,
});

export const createMemorySessionStore = (
  initialSession: ApplicationSession | null = null,
): SessionStore => {
  let current = initialSession ? copySession(initialSession) : null;

  return {
    clear: () => {
      current = null;
      return Promise.resolve();
    },
    read: () => Promise.resolve(current ? copySession(current) : null),
    write: (session) => {
      current = copySession(session);
      return Promise.resolve();
    },
  };
};
