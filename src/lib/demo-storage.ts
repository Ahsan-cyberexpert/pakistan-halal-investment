const ROZIQ_STORAGE_PREFIX = 'roziq_';
const DEMO_STORAGE_PREFIX = 'roziq_demo_';

export const demoStorage = {
  clear() {
    if (typeof window === 'undefined') return;

    for (const storage of [window.localStorage, window.sessionStorage]) {
      const keysToRemove: string[] = [];
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key && (key.startsWith(ROZIQ_STORAGE_PREFIX) || key.startsWith(DEMO_STORAGE_PREFIX))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => storage.removeItem(key));
    }
  },
};

export function createDemoReference(type: string, timestamp = Date.now()) {
  const normalizedType = type.replace(/[^a-z0-9]+/gi, '-').toUpperCase();
  return `RZQ-DEMO-${normalizedType}-${timestamp.toString(36).toUpperCase()}`;
}
