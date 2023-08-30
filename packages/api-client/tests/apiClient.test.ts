import { expect, test } from "vitest";
import ApiClient from "../src/ApiClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const apiPrefix = "customprefix";

test("Create default instance of class", () => {
  const defaultClient = new ApiClient(baseUrl);
  expect(defaultClient).toBeInstanceOf(ApiClient);
  expect(defaultClient.baseUrl).toBe(baseUrl);
  expect(defaultClient.fetch).toBeTypeOf("function");
});

test("Create instance of class with options", () => {
  const optionsClient = new ApiClient(baseUrl, { apiPrefix });
  expect(optionsClient).toBeInstanceOf(ApiClient);
  expect(optionsClient.baseUrl).toBe(baseUrl);
  expect(optionsClient.fetch).toBeTypeOf("function");
  expect(optionsClient.apiPrefix).toBe(apiPrefix);
});

test("ApiClient class can be extended", () => {
  class ExtendedApiClient extends ApiClient {}
  expect(new ExtendedApiClient(baseUrl)).toBeInstanceOf(ApiClient);
});

test("Instance without baseUrl throws error", () => {
  // @ts-ignore
  expect(() => new ApiClient()).toThrowError("baseUrl is required");
});
