import { expect, test } from "vitest";
import { JsonApiClient } from "../src/JsonApiClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const client = new JsonApiClient(baseUrl);

test("constructor sets baseUrl", () => {
  expect(client.baseUrl).toBe(baseUrl);
});
