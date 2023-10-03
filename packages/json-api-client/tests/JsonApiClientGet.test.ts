import JsonApiClient from "../src/JsonApiClient";
import nodePage from "./mocks/data/node-page.json";
import nodePageEnglish from "./mocks/data/node-page-en.json";
import nodePageSpanish from "./mocks/data/node-page-es.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const defaultLocale = "en";

const overrideLocale = "es";

describe("JsonApiClient", () => {
  it("should fetch data for a given type", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "node--page";
    const result = await apiClient.get(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePage);
  });
  it("should fetch data for a given type with default locale", async () => {
    const apiClient = new JsonApiClient(baseUrl, { defaultLocale });
    const type = "node--page";
    const result = await apiClient.get(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePageEnglish);
  });

  it("should fetch data for a given type with overridden locale", async () => {
    const apiClient = new JsonApiClient(baseUrl, { defaultLocale });
    const type = "node--page";
    const result = await apiClient.get(type, { locale: overrideLocale });

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePageSpanish);
  });
});
