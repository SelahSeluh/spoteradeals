import { useState, useEffect, useCallback } from 'react';
import { SearchHistoryItem } from '../types';
import { safeStorage } from '../utils/storage';

const MAX_SEARCHES = 10;

export function useSearchHistory(userId?: string) {
  const storageKey = `spotera_search_history_${userId || 'guest'}`;

  const loadHistory = useCallback((): SearchHistoryItem[] => {
    try {
      const raw = safeStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, MAX_SEARCHES);
      }
      return [];
    } catch {
      return [];
    }
  }, [storageKey]);

  const [history, setHistory] = useState<SearchHistoryItem[]>(loadHistory);

  // Sync when userId changes
  useEffect(() => {
    setHistory(loadHistory());
  }, [loadHistory]);

  const saveHistory = useCallback(
    (items: SearchHistoryItem[]) => {
      setHistory(items);
      try {
        safeStorage.setItem(storageKey, JSON.stringify(items));
      } catch (err) {
        console.warn('Could not save search history:', err);
      }
    },
    [storageKey]
  );

  const addSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || trimmed.length < 2) return;

      const current = loadHistory();
      // Remove any existing case-insensitive duplicate
      const filtered = current.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());
      const newItem: SearchHistoryItem = {
        id: 'sh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        query: trimmed,
        timestamp: Date.now(),
      };
      const updated = [newItem, ...filtered].slice(0, MAX_SEARCHES);
      saveHistory(updated);
    },
    [loadHistory, saveHistory]
  );

  const removeSearch = useCallback(
    (id: string) => {
      const current = loadHistory();
      const updated = current.filter((item) => item.id !== id);
      saveHistory(updated);
    },
    [loadHistory, saveHistory]
  );

  const clearAll = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  return {
    history,
    addSearch,
    removeSearch,
    clearAll,
  };
}
