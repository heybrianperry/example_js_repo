import { expect, test } from "vitest";
import { ApiClient } from "../src/ApiClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const client = new ApiClient(baseUrl);

test("constructor sets baseUrl", () => {
  expect(client.baseUrl).toBe(baseUrl);
});
