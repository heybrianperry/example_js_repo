import Jsona from "jsona";
import { Deserializer } from "jsonapi-serializer";
import { JsonApiClient } from "../src/JsonApiClient";
import nodeRecipeSingleResource from "./mocks/data/node-recipe-en-single-resource.json";
import nodeRecipeSingleSpanish from "./mocks/data/node-recipe-es-single-resource.json";
import nodeRecipeSingleJsona from "./mocks/data/node-recipe-resource-deserialize-jsona.json";
import nodeRecipeSingleJsonAPISerializer from "./mocks/data/node-recipe-resource-deserialize-jsonapi-serializer.json";
import unresolvedRecipe from "./mocks/data/unresolved-recipe.json";
import { RawApiResponseWithData } from "../src";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const defaultLocale = "en";
const overrideLocale = "es";
const path = "/recipes/deep-mediterranean-quiche";
const esPath = "path=/recipes/quiche-mediterráneo-profundo";

describe("JsonApiClient.getResourceByPath()", () => {
  it("should fetch data for an individual resource", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const result = await apiClient.getResourceByPath(path);
    expect(result).toEqual(nodeRecipeSingleResource);
  });
  // Should throw an error if the path is invalid
  it("should throw an error if path can not be resolved", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    try {
      const result = await apiClient.getResourceByPath(
        "/recipes/deep-mediterranean-quiche-invalid",
      );
      expect(result).toEqual(unresolvedRecipe);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });
  it("should throw an error if an error occurred in fetch", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(client, "log");
    const fetchSpy = vi.spyOn(client, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await client.getResourceByPath(path);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(fetchSpy).toHaveBeenCalledOnce();
    }
  });

  it("should fetch resource data for a given type and with custom serializer using olosegres/jsona", async () => {
    const apiClient = new JsonApiClient(baseUrl, { serializer: new Jsona() });
    const result = await apiClient.getResourceByPath(path);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeSingleJsona);
  });

  it("should fetch resource data for a given type and with custom serializer using SeyZ/jsonapi-serializer", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      serializer: new Deserializer({
        keyForAttribute: "camelCase",
      }),
    });
    const result = await apiClient.getResourceByPath(path);
    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeSingleJsonAPISerializer);
  });

  test("should fetch raw response", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await client.getResourceByPath(path, {
      rawResponse: true,
    })) as RawApiResponseWithData<typeof nodeRecipeSingleResource>;

    // Assert that the json data was fetched correctly
    expect(json).toEqual(nodeRecipeSingleResource);

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
    expect(rawJson).toEqual(nodeRecipeSingleResource);
  });

  it("should fetch resource data for a given path using the default locale", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      defaultLocale: overrideLocale,
    });
    const result = await apiClient.getResourceByPath(esPath);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeSingleSpanish);
  });
  it("should fetch resource data for a given type with overridden locale", async () => {
    const apiClient = new JsonApiClient(baseUrl, { defaultLocale });
    const result = await apiClient.getResourceByPath(esPath, {
      locale: overrideLocale,
    });

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeSingleSpanish);
  });
  it("should use authentication if provided", async () => {
    const client = new JsonApiClient(baseUrl, {
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    const addAuthHeaderSpy = vi.spyOn(client, "addAuthorizationHeader");
    await client.getResourceByPath(path);
    expect(addAuthHeaderSpy).toHaveBeenCalledOnce();
  });
  it("should not use authentication if disabled", async () => {
    const client = new JsonApiClient(baseUrl, {
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    const authSpy = vi.spyOn(client, "addAuthorizationHeader");
    await client.getResourceByPath(path, { disableAuthentication: true });
    expect(authSpy).toBeCalledTimes(0);
  });
});
