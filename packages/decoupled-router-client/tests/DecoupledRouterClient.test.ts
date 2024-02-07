import { DecoupledRouterClient } from "../src/DecoupledRouterClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const apiPrefix = "customprefix";

test("Create default instance of class with base url only", () => {
  const defaultClient = new DecoupledRouterClient(baseUrl);
  expect(defaultClient).toBeInstanceOf(DecoupledRouterClient);
  expect(defaultClient.baseUrl).toBe(baseUrl);
  expect(defaultClient.fetch).toBeTypeOf("function");
  expect(defaultClient.apiPrefix).toBe("router/translate-path");
});

test("Create instance of class with api prefix options", () => {
  const optionsClient = new DecoupledRouterClient(baseUrl, { apiPrefix });
  expect(optionsClient).toBeInstanceOf(DecoupledRouterClient);
  expect(optionsClient.baseUrl).toBe(baseUrl);
  expect(optionsClient.fetch).toBeTypeOf("function");
  expect(optionsClient.apiPrefix).toBe(apiPrefix);
});
