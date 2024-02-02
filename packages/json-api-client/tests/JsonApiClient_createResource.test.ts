import { JsonApiClient } from "../src/JsonApiClient";
import nodePageCreateRequest from "./mocks/data/node-page-create-request.json";
import notFoundResponse from "./mocks/data/404.json";
import nodePageCreate from "./mocks/data/node-page-create-response.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const type = "node--page";
const invalidType = "node--invalid-bundle";

describe("JsonApiClient.createResource()", () => {
  it("should create resource when passed body with type as string and return response with 201 status", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const result = await apiClient.createResource(
      type,
      JSON.stringify(nodePageCreateRequest),
    );
    expect(result.status).toEqual(201);
    const resultBody = await result.json();
    expect(JSON.stringify(resultBody)).toEqual(JSON.stringify(nodePageCreate));
  });

  it("should create resource when passed body with type as object and return response with 201 status", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const result = await apiClient.createResource(type, nodePageCreateRequest);
    expect(result.status).toEqual(201);
    const resultBody = await result.json();
    expect(JSON.stringify(resultBody)).toEqual(JSON.stringify(nodePageCreate));
  });

  it("should give 404 for invalid bundle type and return response with 404 status", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const result = await apiClient.createResource(
      invalidType,
      JSON.stringify(notFoundResponse),
    );
    expect(result.status).toEqual(404);
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
});
