import Jsona from "jsona";
import { Deserializer } from "jsonapi-serializer";
import { RawApiResponseWithData } from "../src";
import { JsonApiClient } from "../src/JsonApiClient";
import nodePageEnglish from "./mocks/data/node-page-en.json";
import nodePageSpanish from "./mocks/data/node-page-es.json";
import nodePage from "./mocks/data/node-page.json";
import nodeRecipeJsona from "./mocks/data/node-recipe-deserialize-jsona.json";
import nodeRecipeJsonAPISerializer from "./mocks/data/node-recipe-deserialize-jsonapi-serializer.json";
import nodeRecipeFilter from "./mocks/data/node-recipe-filter.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";

const defaultLocale = "en";

const overrideLocale = "es";

describe("JsonApiClient.getCollection()", () => {
  it("should fetch collection data for a given type", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "node--page";
    const result = await apiClient.getCollection(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePage);
  });

  it("should fetch data for an individual resource using the index", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      indexLookup: true,
      debug: true,
    });
    const type = "custompage";
    const result = await apiClient.getCollection(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePageEnglish);
  });

  it("should fetch collection data for a given type with default locale", async () => {
    const apiClient = new JsonApiClient(baseUrl, { defaultLocale });
    const type = "node--page";
    const result = await apiClient.getCollection(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePageEnglish);
  });

  it("should fetch collection data for a given type with overridden locale", async () => {
    const apiClient = new JsonApiClient(baseUrl, { defaultLocale });
    const type = "node--page";
    const result = await apiClient.getCollection(type, {
      locale: overrideLocale,
    });

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePageSpanish);
  });

  it("should fetch collection data for a given type with overridden locale using the index", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      defaultLocale,
      indexLookup: true,
    });
    const type = "node--page";
    const result = await apiClient.getCollection(type, {
      locale: overrideLocale,
    });

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodePageSpanish);
  });

  it("should fetch collection data for a given type and with custom serializer using olosegres/jsona", async () => {
    const apiClient = new JsonApiClient(baseUrl, { serializer: new Jsona() });
    const type = "node--recipe";
    const result = await apiClient.getCollection(type);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeJsona);
  });

  it("should fetch collection data for a given type and with custom serializer using SeyZ/jsonapi-serializer", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      serializer: new Deserializer({
        keyForAttribute: "camelCase",
      }),
    });
    const type = "node--recipe";
    const result = await apiClient.getCollection(type);
    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeJsonAPISerializer);
  });

  it("should log a debug message when 'getCollection' method is called", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const type = "node--recipe";
    const logSpy = vi.spyOn(client, "log");
    await client.getCollection(type);
    expect(logSpy).toHaveBeenCalledOnce();
  });

  it("should fetch data for a given type and filter", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "node--recipe";
    const queryString = "filter[field_cooking_time][value]=30";
    const result = await apiClient.getCollection(type, { queryString });
    expect(result).toEqual(nodeRecipeFilter);
  });

  it("should fetch data for a given type and filter using the index", async () => {
    const apiClient = new JsonApiClient(baseUrl, { indexLookup: true });
    const type = "node--recipe";
    const queryString = "filter[field_cooking_time][value]=30";
    const result = await apiClient.getCollection(type, { queryString });
    expect(result).toEqual(nodeRecipeFilter);
  });

  it("should fetch raw response", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const type = "node--page";
    const { response, json } = (await client.getCollection(type, {
      rawResponse: true,
    })) as RawApiResponseWithData<typeof nodePage>;

    // Assert that the json data was fetched correctly
    expect(json).toEqual(nodePage);

    // Check if response is an instance of the Response class
    expect(response instanceof Response).toBe(true);

    // Check the HTTP status code
    expect(response.status).toEqual(200);

    // Check the status text
    expect(response.statusText).toEqual("Ok");

    // Check if headers are present
    expect(response.headers).toBeDefined();

    // Confirm json can be read from response stream
    const rawJson = await response.json();
    expect(rawJson).toEqual(nodePage);
  });
  it("should throw an error if an error occurred in fetch", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const type = "node--page";
    const logSpy = vi.spyOn(client, "log");
    const fetchSpy = vi.spyOn(client, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await client.getCollection(type);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(fetchSpy).toHaveBeenCalledOnce();
    }
  });

  it("should use authentication if provided", async () => {
    const client = new JsonApiClient(baseUrl, {
      debug: true,
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    const type = "node--page";
    const addAuthHeaderSpy = vi.spyOn(client, "addAuthorizationHeader");
    await client.getCollection(type);
    expect(addAuthHeaderSpy).toHaveBeenCalledOnce();
  });
  it("should not use authentication if disabled", async () => {
    const client = new JsonApiClient(baseUrl, {
      debug: true,
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    const type = "node--page";
    await client.getCollection(type, { disableAuthentication: true });
    const authSpy = vi.spyOn(client, "addAuthorizationHeader");
    expect(authSpy).toBeCalledTimes(0);
  });
});
