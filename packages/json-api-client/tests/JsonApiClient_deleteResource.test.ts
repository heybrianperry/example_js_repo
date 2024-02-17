import { JsonApiClient } from "../src/JsonApiClient";
import { RawApiResponseWithData } from "../src";
import notFoundResponse from "./mocks/data/404.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const resourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f6";
const invalidResourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f7";
const type = "node--page";

describe("JsonApiClient.deleteResource()", () => {
  it("should delete resource when passed rawResponse as true and return raw response  with 204 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.deleteResource(
      type,
      resourceId,
      { rawResponse: true },
    )) as RawApiResponseWithData<string>;
    expect(response.status).toEqual(204);
    expect(json).toEqual("");
  });

  it("should delete resource when passed rawResponse as false and return raw response with 204 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const json = (await apiClient.deleteResource(type, resourceId, {
      rawResponse: false,
    })) as RawApiResponseWithData<string>;
    expect(json).toEqual("");
  });

  it("For invalid resource id when passed with rawResponse as true should return raw response with 404 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.deleteResource(
      type,
      invalidResourceId,
      { rawResponse: true },
    )) as RawApiResponseWithData<typeof notFoundResponse>;
    expect(response.status).toEqual(404);
    expect(JSON.stringify(json)).toEqual(JSON.stringify(notFoundResponse));
  });
  it("should throw an error if one occurs in fetch", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(apiClient, "log");
    vi.spyOn(apiClient, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await apiClient.deleteResource(type, invalidResourceId);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(logSpy).toHaveBeenLastCalledWith(
        "error",
        `Failed to delete resource. ResourceId: ${invalidResourceId}, Error: Something went wrong`,
      );
    }
  });
});
