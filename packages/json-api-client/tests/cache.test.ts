import type { SpyInstance } from "vitest";
import { JsonApiClient, createCache } from "../src";
import notFound from "./mocks/data/404.json";
import index from "./mocks/data/index.json";

interface CacheTestContext {
  client: JsonApiClient;
  indexClient: JsonApiClient;
  cacheSpy: {
    get: SpyInstance;
    set: SpyInstance;
  };
  fetchSpy?: SpyInstance;
  indexFetchSpy?: SpyInstance;
  resourceId: string;
}

describe("Cache", () => {
  beforeEach<CacheTestContext>((context) => {
    const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
    const cache = createCache();
    context.client = new JsonApiClient(baseUrl, {
      cache,
      debug: true,
    });
    context.indexClient = new JsonApiClient(baseUrl, {
      cache,
      debug: true,
      indexLookup: true,
    });
    context.fetchSpy = vi.spyOn(context.client, "fetch");
    context.indexFetchSpy = vi.spyOn(context.indexClient, "fetch");
    context.cacheSpy = {
      get: vi.spyOn(cache, "get"),
      set: vi.spyOn(cache, "set"),
    };
    context.resourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f6";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it<CacheTestContext>("should be able to set a collection value", async ({
    client,
    cacheSpy,
  }) => {
    const result = await client.getCollection("node--recipe");

    expect(cacheSpy.set).toHaveBeenCalled();
    expect(cacheSpy.set).toHaveBeenCalledWith("node--recipe", result);
  });

  it<CacheTestContext>("should be able to set a collection value using the index", async ({
    indexClient,
    cacheSpy,
  }) => {
    const result = await indexClient.getCollection("node--recipe");

    expect(cacheSpy.set).toHaveBeenCalledTimes(2);
    expect(cacheSpy.set).toHaveBeenNthCalledWith(1, "jsonapi", index);
    expect(cacheSpy.set).toHaveBeenNthCalledWith(2, "node--recipe", result);
  });

  it<CacheTestContext>("should be able to get a collection value", async ({
    client,
    cacheSpy,
    fetchSpy,
  }) => {
    await client.getCollection("node--recipe");
    expect(cacheSpy.get).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(cacheSpy.get).toHaveBeenCalledWith("node--recipe");
    expect(cacheSpy.get).toHaveReturnedWith(client.cache?.get("node--recipe"));

    // Call again to ensure we're getting the cached value
    await client.getCollection("node--recipe");
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(cacheSpy.get).toHaveReturnedWith(client.cache?.get("node--recipe"));
  });

  it<CacheTestContext>("should be able to get a collection value using a cached index", async ({
    indexClient,
    cacheSpy,
    indexFetchSpy,
  }) => {
    await indexClient.getCollection("node--recipe");
    // Check the cache for both the collection and the index
    expect(cacheSpy.get).toHaveBeenCalledTimes(2);
    expect(cacheSpy.get).toHaveBeenNthCalledWith(1, "node--recipe");
    expect(cacheSpy.get).toHaveBeenNthCalledWith(2, "jsonapi");
    // Fetch the index and the collection
    expect(indexFetchSpy).toHaveBeenCalledTimes(2);
    // Confirm the index was set in the cache
    expect(cacheSpy.set).toHaveBeenNthCalledWith(1, "jsonapi", index);

    // Call a different collection to ensure we're using the cached index
    await indexClient.getCollection("custompage");
    // Check the cache for both the collection and the index
    expect(cacheSpy.get).toHaveBeenNthCalledWith(3, "custompage");
    expect(cacheSpy.get).toHaveBeenNthCalledWith(4, "jsonapi");
    // Only fetch the collection since the index was a cache hit
    expect(indexFetchSpy).toHaveBeenCalledTimes(3);
    // Confirm the cache has the correct index value
    expect(await indexClient.cache?.get("jsonapi")).toEqual(index);
  });

  it<CacheTestContext>("should be able to set a resource value", async ({
    client,
    cacheSpy,
    resourceId,
  }) => {
    const result = await client.getResource("node--recipe", resourceId);

    expect(cacheSpy.set).toHaveBeenCalled();
    expect(cacheSpy.set).toHaveBeenCalledWith(
      `node--recipe--${resourceId}`,
      result,
    );
  });
  it<CacheTestContext>("should be able to get a resource value", async ({
    client,
    cacheSpy,
    fetchSpy,
    resourceId,
  }) => {
    await client.getResource("node--recipe", resourceId);
    expect(cacheSpy.get).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(cacheSpy.get).toHaveBeenCalledWith(`node--recipe--${resourceId}`);
    expect(cacheSpy.get).toHaveReturnedWith(
      client.cache?.get(`node--recipe--${resourceId}`),
    );

    // Call again to ensure we're getting the cached value
    await client.getResource("node--recipe", resourceId);
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(cacheSpy.get).toHaveReturnedWith(
      client.cache?.get(`node--recipe--${resourceId}`),
    );
  });

  it<CacheTestContext>("should bypass cache when retrieving a value and do not set the value in the cache", async ({
    client,
    cacheSpy,
    fetchSpy,
  }) => {
    await client.getCollection("node--recipe", { disableCache: true });
    expect(cacheSpy.get).not.toHaveBeenCalled();
    expect(cacheSpy.set).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it<CacheTestContext>("should bypass cache when retrieving a value and do not set the value in the cache", async ({
    client,
    cacheSpy,
    fetchSpy,
    resourceId,
  }) => {
    await client.getResource("node--recipe", resourceId, {
      disableCache: true,
    });
    expect(cacheSpy.get).not.toHaveBeenCalled();
    expect(cacheSpy.set).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
  it<CacheTestContext>("should not set the item in the cache for a collection if the response status code is greater than 400", async ({
    client,
    cacheSpy,
    fetchSpy,
  }) => {
    const type = "node--rcipe";
    const result = await client.getCollection(type);
    expect(result).toEqual({
      jsonapi: {
        version: "1.0",
        meta: {
          links: {
            self: {
              href: "http://jsonapi.org/format/1.0/",
            },
          },
        },
      },
      errors: [
        {
          title: "Not Found",
          status: "404",
        },
      ],
    });
    expect(cacheSpy.set).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
  it<CacheTestContext>("should not set the item in the cache for a resource if the response status code is greater than 400", async ({
    client,
    cacheSpy,
    fetchSpy,
  }) => {
    const type = "node--recipe";
    const resourceId = "invalid-uuid";
    const result = await client.getResource(type, resourceId);
    expect(result).toEqual(notFound);
    expect(cacheSpy.set).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
});
