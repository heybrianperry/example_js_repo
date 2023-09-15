import JsonApiClient from "../src/JsonApiClient";
import nodePage from "./mocks/data/node-page.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

describe("JsonApiClient", () => {
  it("should fetch data for a given type", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "node--page";
    const result = await apiClient.get(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePage);
  });
});
