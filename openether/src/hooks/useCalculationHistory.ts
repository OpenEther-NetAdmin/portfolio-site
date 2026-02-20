/**
 * useCalculationHistory Hook
 * Manages tool-specific calculation history in localStorage
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * A single history entry
 */
export interface HistoryEntry<TInput, TResult = TInput> {
  /** Unique identifier for this entry */
  id: string;
  /** Unix timestamp when the calculation was performed */
  timestamp: number;
  /** The input data used for the calculation */
  input: TInput;
  /** The result of the calculation */
  result: TResult;
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
interface UseCalculationHistoryReturn<TInput, TResult = TInput> {
  /** List of history entries, newest first */
  history: HistoryEntry<TInput, TResult>[];
  /** Add a new entry to history */
  addEntry: (entry: Omit<HistoryEntry<TInput, TResult>, 'id' | 'timestamp'>) => void;
  /** Remove a specific entry by ID */
  removeEntry: (id: string) => void;
  /** Clear all history */
  clearHistory: () => void;
  /** Export history as JSON string */
  exportHistory: () => string;
  /** Import history from JSON string */
  importHistory: (json: string) => boolean;
  /** Get a specific entry by ID */
  getEntry: (id: string) => HistoryEntry<TInput, TResult> | undefined;
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
 * Save data to localStorage with quota management
 * Prevents QuotaExceededError by managing storage size
 */
function saveToLocalStorage<T>(data: T[], key: string): void {
  const serialized = JSON.stringify(data);
  
  // Check size limit (5MB)
  const sizeInMB = new Blob([serialized]).size / (1024 * 1024);
  if (sizeInMB > 5) {
    console.warn(`History size (${sizeInMB.toFixed(2)}MB) exceeds 5MB limit, reducing entries`);
    // Remove oldest 30% of entries
    const reduced = data.slice(0, Math.floor(data.length * 0.7));
    localStorage.setItem(key, JSON.stringify(reduced));
    return;
  }
  
  localStorage.setItem(key, serialized);
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
export function useCalculationHistory<TInput, TResult = TInput>(
  key: string,
  options: UseCalculationHistoryOptions = {}
): UseCalculationHistoryReturn<TInput, TResult> {
  const { limit = 50, version = 'v1' } = options;

  // Create the full storage key with version
  const storageKey = `${key}-${version}`;

  // Initialize state from localStorage
  const [history, setHistory] = useState<HistoryEntry<TInput, TResult>[]>([]);
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
        const parsed = safeJsonParse<HistoryEntry<TInput, TResult>[]>(stored);
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
      saveToLocalStorage(history, storageKey);
    } catch (error) {
      console.error(`Failed to save history for key "${storageKey}":`, error);
    }
  }, [history, storageKey, isInitialized]);

  // Add a new entry
  const addEntry = useCallback(
    (entry: Omit<HistoryEntry<TInput, TResult>, 'id' | 'timestamp'>) => {
      const newEntry: HistoryEntry<TInput, TResult> = {
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
    const parsed = safeJsonParse<HistoryEntry<TInput, TResult>[]>(json);
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
    (id: string): HistoryEntry<TInput, TResult> | undefined => {
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
