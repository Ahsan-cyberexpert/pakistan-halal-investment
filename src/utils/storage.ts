/**
 * ==============================================================================
 * Safe LocalStorage Wrapper Utility
 * Prevents SSR crashes, handles JSON parse errors gracefully, and offers strong typing.
 * ==============================================================================
 */

export function getSafeStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[SafeStorage] Error reading key "${key}":`, error);
    return fallback;
  }
}

export function setSafeStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[SafeStorage] Error writing key "${key}":`, error);
    return false;
  }
}

export function removeSafeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[SafeStorage] Error removing key "${key}":`, error);
  }
}
