import ApiClient from "../src/ApiClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
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
