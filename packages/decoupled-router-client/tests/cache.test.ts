import type { SpyInstance } from "vitest";
import { DecoupledRouterClient } from "../src";

interface CacheTestContext {
  client: DecoupledRouterClient;
  cacheSpy: {
    get: SpyInstance;
    set: SpyInstance;
  };
  fetchSpy?: SpyInstance;
  path: string;
  unResolvedPath: string;
}

describe("Cache", () => {
  beforeEach<CacheTestContext>((context) => {
    const baseUrl = "https://drupal-contributions.lndo.site";
    const store = new Map();
    const cache = {
      get: async (key: string) => store.get(key),
      set: async <T>(key: string, value: T) => store.set(key, value),
    };
    context.client = new DecoupledRouterClient(baseUrl, { cache, debug: true });
    context.fetchSpy = vi.spyOn(context.client, "fetch");
    context.cacheSpy = {
      get: vi.spyOn(cache, "get"),
      set: vi.spyOn(cache, "set"),
    };
    context.path = "/articles/give-it-a-go-and-grow-your-own-herbs";
    context.unResolvedPath = "/articles/unresolved-path";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it<CacheTestContext>("should be able to set a path value for a resolved path", async ({
    client,
    cacheSpy,
    path,
  }) => {
    const result = await client.translatePath(path);

    expect(cacheSpy.set).toHaveBeenCalled();
    expect(cacheSpy.set).toHaveBeenCalledWith(path, result);
  });

  it<CacheTestContext>("should be able to get a path value", async ({
    client,
    cacheSpy,
    fetchSpy,
    path,
  }) => {
    await client.translatePath(path);
    expect(cacheSpy.get).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(cacheSpy.get).toHaveBeenCalledWith(path);
    expect(cacheSpy.get).toHaveReturnedWith(client.cache?.get(path));

    // Call again to ensure we're getting the cached value
    await client.translatePath(path);
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(cacheSpy.get).toHaveReturnedWith(client.cache?.get(path));
  });

  it<CacheTestContext>("should bypass cache when retrieving a value and do not set the value in the cache", async ({
    client,
    cacheSpy,
    fetchSpy,
    path,
  }) => {
    await client.translatePath(path, {
      disableCache: true,
    });
    expect(cacheSpy.get).not.toHaveBeenCalled();
    expect(cacheSpy.set).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it<CacheTestContext>("should not set the item in the cache for an unresolved path", async ({
    client,
    cacheSpy,
    fetchSpy,
    unResolvedPath,
  }) => {
    await client.translatePath(unResolvedPath);
    expect(cacheSpy.set).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it<CacheTestContext>("should use a custom cache key when provided", async ({
    client,
    cacheSpy,
    fetchSpy,
    path,
  }) => {
    const result = await client.translatePath(path, {
      cacheKey: "custom-cache-key",
    });

    expect(cacheSpy.set).toHaveBeenCalledWith("custom-cache-key", result);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
  it<CacheTestContext>("should throw an error if cacheKey or path are missing", async ({
    client,
  }) => {
    try {
      await client.translatePath("");
    } catch (_) {
      expect(_).toBeInstanceOf(Error);
      if (_ instanceof Error) {
        expect(_.message).toBe(
          "The path or cacheKey option is required to generate a cache key.",
        );
      }
    }
  });
});
