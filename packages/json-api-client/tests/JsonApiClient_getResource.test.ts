import Jsona from "jsona";
import { Deserializer } from "jsonapi-serializer";
import { RawApiResponseWithData } from "../src";
import { JsonApiClient } from "../src/JsonApiClient";
import nodeRecipeSingleResource from "./mocks/data/node-recipe-en-single-resource.json";
import nodeRecipeSingleSpanish from "./mocks/data/node-recipe-es-single-resource.json";
import nodeRecipeSingleJsona from "./mocks/data/node-recipe-resource-deserialize-jsona.json";
import nodeRecipeSingleJsonAPISerializer from "./mocks/data/node-recipe-resource-deserialize-jsonapi-serializer.json";
import nodeRecipeSingleSerializedJsona from "./mocks/data/node-recipe-resource-reserialize-jsona.json";

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

    // And that we can re-serialize the data
    const serializedData = apiClient.serializer?.serialize
      ? apiClient.serializer.serialize({ stuff: result })
      : null;
    expect(serializedData).toEqual(nodeRecipeSingleSerializedJsona);
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

  test("should fetch raw response", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const type = "node--recipe";
    const { response, json } = (await client.getResource(type, resourceId, {
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
  it("should throw an error if an error occurred in fetch", async () => {
    const client = new JsonApiClient(baseUrl, { debug: true });
    const type = "node--recipe";
    const logSpy = vi.spyOn(client, "log");
    const fetchSpy = vi.spyOn(client, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await client.getResource(type, resourceId);
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
    const type = "node--recipe";
    const addAuthHeaderSpy = vi.spyOn(client, "addAuthorizationHeader");
    await client.getResource(type, resourceId);
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
    const type = "node--recipe";
    await client.getResource(type, resourceId, { disableAuthentication: true });
    const authSpy = vi.spyOn(client, "addAuthorizationHeader");
    expect(authSpy).toBeCalledTimes(0);
  });
});
