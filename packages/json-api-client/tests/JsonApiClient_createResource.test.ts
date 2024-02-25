import { JsonApiClient } from "../src/JsonApiClient";
import notFoundResponse from "./mocks/data/404.json";
import nodePageCreateRequest from "./mocks/data/node-page-create-request.json";
import nodePageCreate from "./mocks/data/node-page-create-response.json";
import nodePage1Create from "./mocks/data/node-page1-create-resource-404-response.json";
import { RawApiResponseWithData } from "../src";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const type = "node--page";
const invalidType = "node--invalid-bundle";

describe("JsonApiClient.createResource()", () => {
  it("should create resource when passed body with type as string, rawResponse as true and return raw response  with 201 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.createResource(
      type,
      JSON.stringify(nodePageCreateRequest),
      { rawResponse: true },
    )) as RawApiResponseWithData<typeof nodePageCreate>;
    expect(response.status).toEqual(201);
    expect(JSON.stringify(json)).toEqual(JSON.stringify(nodePageCreate));
  });

  it("should create resource when passed body with type as string, rawResponse as false and return body only", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const json = await apiClient.createResource(
      type,
      JSON.stringify(nodePageCreateRequest),
      { rawResponse: false },
    );
    expect(JSON.stringify(json)).toEqual(JSON.stringify(nodePageCreate));
  });

  it("should create resource when passed body with type as object, rawResponse as true and return raw response with 201 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.createResource(
      type,
      nodePageCreateRequest,
      { rawResponse: true },
    )) as RawApiResponseWithData<typeof nodePageCreate>;
    expect(response.status).toEqual(201);
    expect(JSON.stringify(json)).toEqual(JSON.stringify(nodePageCreate));
  });

  it("should honor the locale option", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const locale = "es";
    const { response, json } = (await apiClient.createResource(
      type,
      nodePageCreateRequest,
      { rawResponse: true, locale },
    )) as RawApiResponseWithData<typeof nodePageCreate>;
    expect(response.status).toEqual(201);
    expect(JSON.stringify(json)).toEqual(JSON.stringify(nodePageCreate));
  });

  it("should give 404 for invalid bundle type, when passed rawResponse as true and return response with 404 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.createResource(
      invalidType,
      JSON.stringify(notFoundResponse),
      { rawResponse: true },
    )) as RawApiResponseWithData<typeof nodePage1Create>;
    expect(response.status).toEqual(404);
    expect(JSON.stringify(json)).toEqual(JSON.stringify(nodePage1Create));
  });
  it("should throw an error if one occurs in fetch", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(apiClient, "log");
    vi.spyOn(apiClient, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await apiClient.createResource(
        invalidType,
        JSON.stringify(nodePageCreateRequest),
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(logSpy).toHaveBeenLastCalledWith(
        "error",
        `Failed to create resource. Error: Something went wrong`,
      );
    }
  });
  it("should use authentication if provided", async () => {
    const client = new JsonApiClient(baseUrl, {
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    const addAuthHeaderSpy = vi.spyOn(client, "addAuthorizationHeader");
    await client.createResource(type, JSON.stringify(nodePageCreateRequest));
    expect(addAuthHeaderSpy).toHaveBeenCalledOnce();
  });
  it("should not use authentication if disabled", async () => {
    const client = new JsonApiClient(baseUrl, {
      authentication: {
        type: "Basic",
        credentials: { username: "testUser", password: "testPassword" },
      },
    });
    const addAuthHeaderSpy = vi.spyOn(client, "addAuthorizationHeader");
    await client.createResource(type, JSON.stringify(nodePageCreateRequest), {
      disableAuthentication: true,
    });
    expect(addAuthHeaderSpy).toBeCalledTimes(0);
  });
});
