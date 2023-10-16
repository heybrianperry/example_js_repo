import Jsona from "jsona";
import { Deserializer } from "jsonapi-serializer";
import JsonApiClient from "../src/JsonApiClient";
import nodePage from "./mocks/data/node-page.json";
import nodePageEnglish from "./mocks/data/node-page-en.json";
import nodePageSpanish from "./mocks/data/node-page-es.json";
import nodeRecipeJsona from "./mocks/data/node-recipe-deserialize-jsona.json";
import nodeRecipeJsonAPISerializer from "./mocks/data/node-recipe-deserialize-jsonapi-serializer.json";
import nodePageFilter from "./mocks/data/node-page-filter.json";

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

  it("should fetch data for a given type and with custom serializer using olosegres/jsona", async () => {
    const apiClient = new JsonApiClient(baseUrl, { serializer: new Jsona() });
    const type = "node--recipe";
    const result = await apiClient.get(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeJsona);
  });

  it("should fetch data for a given type and with custom serializer using SeyZ/jsonapi-serializer", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      serializer: new Deserializer({
        keyForAttribute: "camelCase",
      }),
    });
    const type = "node--recipe";
    const result = await apiClient.get(type);
    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeJsonAPISerializer);
  });

  test("should log a debug message when 'get' method is called", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const type = "node--recipe";
    const logSpy = vi.spyOn(client, "log");
    await client.get(type);
    expect(logSpy).toHaveBeenCalledOnce();
  });

  it("should fetch data for a given type and filter", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "node--page";
    const queryString = "filter[field_cooking_time][value]=30";
    const result = await apiClient.get(type, { queryString });
    expect(result).toEqual(nodePageFilter);
  });
});
