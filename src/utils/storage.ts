/**
 * Safe Storage Utility for SpoteraDeals
 * Wraps localStorage and sessionStorage with try-catch and memory fallback
 * to prevent crashes in restricted iframe environments (e.g. AI Studio preview).
 */

const memoryStore: Record<string, string> = {};
const sessionMemoryStore: Record<string, string> = {};

function getLocalSafe(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch (_) {
    return null;
  }
}

function getSessionSafe(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage;
  } catch (_) {
    return null;
  }
}

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      const storage = getLocalSafe();
      if (storage) {
        return storage.getItem(key);
      }
    } catch (_) {}
    return memoryStore[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      const storage = getLocalSafe();
      if (storage) {
        storage.setItem(key, value);
      }
    } catch (_) {}
    memoryStore[key] = value;
  },

  removeItem: (key: string): void => {
    try {
      const storage = getLocalSafe();
      if (storage) {
        storage.removeItem(key);
      }
    } catch (_) {}
    delete memoryStore[key];
  },

  getSessionItem: (key: string): string | null => {
    try {
      const storage = getSessionSafe();
      if (storage) {
        return storage.getItem(key);
      }
    } catch (_) {}
    return sessionMemoryStore[key] ?? null;
  },

  setSessionItem: (key: string, value: string): void => {
    try {
      const storage = getSessionSafe();
      if (storage) {
        storage.setItem(key, value);
      }
    } catch (_) {}
    sessionMemoryStore[key] = value;
  },

  removeSessionItem: (key: string): void => {
    try {
      const storage = getSessionSafe();
      if (storage) {
        storage.removeItem(key);
      }
    } catch (_) {}
    delete sessionMemoryStore[key];
  },
};

export const safeLocalStorage = {
  getItem: (key: string) => safeStorage.getItem(key),
  setItem: (key: string, value: string) => safeStorage.setItem(key, value),
  removeItem: (key: string) => safeStorage.removeItem(key),
};

export const safeSessionStorage = {
  getItem: (key: string) => safeStorage.getSessionItem(key),
  setItem: (key: string, value: string) => safeStorage.setSessionItem(key, value),
  removeItem: (key: string) => safeStorage.removeSessionItem(key),
};
