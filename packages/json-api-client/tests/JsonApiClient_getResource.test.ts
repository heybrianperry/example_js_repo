import Jsona from "jsona";
import { Deserializer } from "jsonapi-serializer";
import { JsonApiClient } from "../src/JsonApiClient";
import nodeRecipeSingleResource from "./mocks/data/node-recipe-en-single-resource.json";
import nodeRecipeSingleSpanish from "./mocks/data/node-recipe-es-single-resource.json";
import nodeRecipeSingleJsona from "./mocks/data/node-recipe-resource-deserialize-jsona.json";
import nodeRecipeSingleJsonAPISerializer from "./mocks/data/node-recipe-resource-deserialize-jsonapi-serializer.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const resourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f6";
const defaultLocale = "en";
const overrideLocale = "es";

describe("JsonApiClient.getResource()", () => {
  it("should fetch data for an individual resource", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "node--recipe";
    const result = await apiClient.getResource(type, resourceId);
    expect(result).toEqual(nodeRecipeSingleResource);
  });
  it("should throw an error if the type is not `entityType--bundle`", async () => {
    const apiClient = new JsonApiClient(baseUrl);
    const type = "nodePage";
    try {
      // @ts-expect-error
      await apiClient.getResource(type, resourceId);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  it("should fetch resource data for a given type with overridden locale", async () => {
    const apiClient = new JsonApiClient(baseUrl, { defaultLocale });
    const type = "node--recipe";
    const result = await apiClient.getResource(type, resourceId, {
      locale: overrideLocale,
    });

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeSingleSpanish);
  });

  it("should fetch resource data for a given type and with custom serializer using olosegres/jsona", async () => {
    const apiClient = new JsonApiClient(baseUrl, { serializer: new Jsona() });
    const type = "node--recipe";
    const result = await apiClient.getResource(type, resourceId);

    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeSingleJsona);
  });

  it("should fetch resource data for a given type and with custom serializer using SeyZ/jsonapi-serializer", async () => {
    const apiClient = new JsonApiClient(baseUrl, {
      serializer: new Deserializer({
        keyForAttribute: "camelCase",
      }),
    });
    const type = "node--recipe";
    const result = await apiClient.getResource(type, resourceId);
    // Assert that the data was fetched correctly
    expect(result).toEqual(nodeRecipeSingleJsonAPISerializer);
  });

  test("should log a debug message when 'getResource' method is called", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const type = "node--recipe";
    const logSpy = vi.spyOn(client, "log");
    await client.getResource(type, resourceId);
    expect(logSpy).toHaveBeenCalledOnce();
  });
});
