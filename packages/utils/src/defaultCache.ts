import { deepMap } from "nanostores";

import type { Cache } from "@drupal-api-client/api-client/src/types";

/**
 * Factory function that created a  default cache implementation that uses the
 * nanostores library.
 * @returns A cache object that satisfies the Cache interface.
 */
export const createCache = () => {
  const store = deepMap<Record<string, unknown>>({});
  return {
    get: async <T>(key: string) => store.get()[key] as T,
    set: async <T>(key: string, value: T) => {
      store.setKey(key, value);
    },
  } satisfies Cache;
};
