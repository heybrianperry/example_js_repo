import { ApiClient } from "../src/ApiClient";

const baseUrl = "https://dev-drupal-api-client.poc";
const apiPrefix = "customprefix";
const defaultLocale = "en";

test("Create default instance of class", () => {
  const defaultClient = new ApiClient(baseUrl);
  expect(defaultClient).toBeInstanceOf(ApiClient);
  expect(defaultClient.baseUrl).toBe(baseUrl);
  expect(defaultClient.fetch).toBeTypeOf("function");
});

test("Create instance of class with options", () => {
  const cache = {
    get: async <T>() => ({}) as T,
    set: async () => {},
  };
  const optionsClient = new ApiClient(baseUrl, {
    apiPrefix,
    cache,
    defaultLocale,
  });
  expect(optionsClient).toBeInstanceOf(ApiClient);
  expect(optionsClient.baseUrl).toBe(baseUrl);
  expect(optionsClient.fetch).toBeTypeOf("function");
  expect(optionsClient.apiPrefix).toBe(apiPrefix);
  expect(optionsClient.cache?.get).toBeDefined();
  expect(optionsClient.cache?.set).toBeDefined();
  expect(optionsClient.defaultLocale).toBe(defaultLocale);
});

test("ApiClient class can be extended", () => {
  class ExtendedApiClient extends ApiClient {}
  expect(new ExtendedApiClient(baseUrl)).toBeInstanceOf(ApiClient);
});

test("Instance without baseUrl throws error", () => {
  // @ts-ignore
  expect(() => new ApiClient()).toThrowError("baseUrl is required");
});

describe("fetch", async () => {
  it("returns an error if one occurs", async () => {
    const client = new ApiClient(baseUrl);
    const { response, error } = await client.fetch("invalidurl");
    expect(response).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("Failed to parse URL from invalidurl");
  });
  it("logs to the console if debug is true and an error occurs", async () => {
    const client = new ApiClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(client, "log");
    const { response, error } = await client.fetch("invalidurl");

    expect(response).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("error", error?.message);
    expect(error?.message).toBe("Failed to parse URL from invalidurl");
  });
  it("returns a response if no error occurs", async () => {
    const client = new ApiClient(baseUrl);
    const url = new URL("/jsonapi/node/article", baseUrl);
    const { response, error } = await client.fetch(url);
    expect(response).toBeDefined();
    expect(error).toBeNull();
  });
});

describe("getCachedResponse", async () => {
  it("Returns null if there is no cache", async () => {
    const client = new ApiClient(baseUrl, { debug: true });
    const response = await client.getCachedResponse("invalidkey");
    console.log("debug", client.debug);
    expect(response).toBeNull();
  });
  it("Returns null if there is no cache hit", async () => {
    const store = new Map();
    const cache = {
      get: async (key: string) => store.get(key),
      set: async <T>(key: string, value: T) => store.set(key, value),
    };
    const client = new ApiClient(baseUrl, { cache, debug: true });
    const response = await client.getCachedResponse("invalidkey");

    expect(response).toBeNull();
  });
  it("Returns a value if there is a cache hit", async () => {
    const store = new Map();
    const cache = {
      get: async (key: string) => store.get(key),
      set: async <T>(key: string, value: T) => store.set(key, value),
    };
    const client = new ApiClient(baseUrl, { cache, debug: true });
    client.cache?.set("validkey", "validvalue");
    const response = await client.getCachedResponse("validkey");

    expect(response).toBe("validvalue");
  });
});
