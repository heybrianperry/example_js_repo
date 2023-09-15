import JsonApiClient from "../src/JsonApiClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const apiPrefix = "customprefix";

test("Create default instance of class with base url only", () => {
  const defaultClient = new JsonApiClient(baseUrl);
  expect(defaultClient).toBeInstanceOf(JsonApiClient);
  expect(defaultClient.baseUrl).toBe(baseUrl);
  expect(defaultClient.fetch).toBeTypeOf("function");
  expect(defaultClient.apiPrefix).toBe("jsonapi");
});

test("Create instance of class with api prefix options", () => {
  const optionsClient = new JsonApiClient(baseUrl, { apiPrefix });
  expect(optionsClient).toBeInstanceOf(JsonApiClient);
  expect(optionsClient.baseUrl).toBe(baseUrl);
  expect(optionsClient.fetch).toBeTypeOf("function");
  expect(optionsClient.apiPrefix).toBe(apiPrefix);
});

test("Instance without baseUrl throws error", () => {
  // @ts-ignore
  expect(() => new JsonApiClient()).toThrowError("baseUrl is required");
});
