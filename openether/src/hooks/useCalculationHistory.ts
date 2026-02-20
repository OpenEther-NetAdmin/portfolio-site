/**
 * useCalculationHistory Hook
 * Manages tool-specific calculation history in localStorage
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * A single history entry
 */
export interface HistoryEntry<T> {
  /** Unique identifier for this entry */
  id: string;
  /** Unix timestamp when the calculation was performed */
  timestamp: number;
  /** The input data used for the calculation */
  input: T;
  /** The result of the calculation */
  result: T;
}

/**
 * Options for configuring the history hook
 */
interface UseCalculationHistoryOptions {
  /** Maximum number of entries to keep (default: 50) */
  limit?: number;
  /** Key suffix for versioning (default: 'v1') */
  version?: string;
}

/**
 * Return type for the useCalculationHistory hook
 */
interface UseCalculationHistoryReturn<T> {
  /** List of history entries, newest first */
  history: HistoryEntry<T>[];
  /** Add a new entry to history */
  addEntry: (entry: Omit<HistoryEntry<T>, 'id' | 'timestamp'>) => void;
  /** Remove a specific entry by ID */
  removeEntry: (id: string) => void;
  /** Clear all history */
  clearHistory: () => void;
  /** Export history as JSON string */
  exportHistory: () => string;
  /** Import history from JSON string */
  importHistory: (json: string) => boolean;
  /** Get a specific entry by ID */
  getEntry: (id: string) => HistoryEntry<T> | undefined;
  /** Number of entries in history */
  count: number;
}

/**
 * Generate a unique ID for history entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Safely parse JSON with error handling
 */
function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * A hook for managing calculation history with localStorage persistence.
 * 
 * @param key - Unique key for this history (e.g., 'subnet-calculator-history')
 * @param options - Configuration options
 * 
 * @example
 * ```tsx
 * interface SubnetInput {
 *   address: string;
 *   cidr: number;
 * }
 * 
 * interface SubnetResult {
 *   networkAddress: string;
 *   broadcastAddress: string;
 *   // ... other fields
 * }
 * 
 * const { history, addEntry, clearHistory } = useCalculationHistory<{
 *   input: SubnetInput;
 *   result: SubnetResult;
 * }>('subnet-history');
 * 
 * // Add an entry
 * addEntry({
 *   input: { address: '192.168.1.0', cidr: 24 },
 *   result: { networkAddress: '192.168.1.0', broadcastAddress: '192.168.1.255', ... }
 * });
 * ```
 */
export function useCalculationHistory<T>(
  key: string,
  options: UseCalculationHistoryOptions = {}
): UseCalculationHistoryReturn<T> {
  const { limit = 50, version = 'v1' } = options;

  // Create the full storage key with version
  const storageKey = `${key}-${version}`;

  // Initialize state from localStorage
  const [history, setHistory] = useState<HistoryEntry<T>[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      // SSR guard
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = safeJsonParse<HistoryEntry<T>[]>(stored);
        if (parsed && Array.isArray(parsed)) {
          // Validate entries have required fields
          const validEntries = parsed.filter(
            (entry) => 
              entry && 
              typeof entry.id === 'string' && 
              typeof entry.timestamp === 'number' &&
              'input' in entry &&
              'result' in entry
          );
          setHistory(validEntries);
        }
      }
    } catch (error) {
      console.error(`Failed to load history for key "${storageKey}":`, error);
    }

    setIsInitialized(true);
  }, [storageKey]);

  // Persist to localStorage whenever history changes (after initial load)
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (error) {
      // Handle localStorage errors (e.g., private mode, quota exceeded)
      console.error(`Failed to save history for key "${storageKey}":`, error);
    }
  }, [history, storageKey, isInitialized]);

  // Add a new entry
  const addEntry = useCallback(
    (entry: Omit<HistoryEntry<T>, 'id' | 'timestamp'>) => {
      const newEntry: HistoryEntry<T> = {
        ...entry,
        id: generateId(),
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        // Add to front and limit size
        const updated = [newEntry, ...prev].slice(0, limit);
        return updated;
      });
    },
    [limit]
  );

  // Remove a specific entry
  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error(`Failed to clear history for key "${storageKey}":`, error);
      }
    }
  }, [storageKey]);

  // Export history as JSON
  const exportHistory = useCallback(() => {
    return JSON.stringify(history, null, 2);
  }, [history]);

  // Import history from JSON
  const importHistory = useCallback((json: string): boolean => {
    const parsed = safeJsonParse<HistoryEntry<T>[]>(json);
    if (!parsed || !Array.isArray(parsed)) {
      return false;
    }

    // Validate entries
    const validEntries = parsed.filter(
      (entry) =>
        entry &&
        typeof entry.id === 'string' &&
        typeof entry.timestamp === 'number' &&
        'input' in entry &&
        'result' in entry
    );

    if (validEntries.length === 0) {
      return false;
    }

    // Sort by timestamp (newest first) and limit
    const sorted = validEntries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    setHistory(sorted);
    return true;
  }, [limit]);

  // Get a specific entry by ID
  const getEntry = useCallback(
    (id: string): HistoryEntry<T> | undefined => {
      return history.find((entry) => entry.id === id);
    },
    [history]
  );

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
    exportHistory,
    importHistory,
    getEntry,
    count: history.length,
  };
}

export default useCalculationHistory;
