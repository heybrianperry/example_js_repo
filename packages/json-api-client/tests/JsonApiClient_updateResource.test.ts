import { JsonApiClient } from "../src/JsonApiClient";
import nodePageUpdateRequest from "./mocks/data/node-page-update-request.json";
import nodePageUpdateResource404Response from "./mocks/data/node-page-update-resource-404-response.json";
import nodePageUpdateResource200Response from "./mocks/data/node-page-update-resource-200-response.json";
import { RawApiResponseWithData } from "../src";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const resourceId = "11fc449b-aca0-4b74-bc3b-677da021f1d7";
const invalidResourceId = "66fc449b-aca0-4b74-bc3b-677da021f1d9";
const type = "node--page";

describe("JsonApiClient.updateResource()", () => {
  it("should update resource when passed body with type as string and rawResponse as true and return response with 200 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.updateResource(
      type,
      resourceId,
      JSON.stringify(nodePageUpdateRequest),
      { rawResponse: true },
    )) as RawApiResponseWithData<typeof nodePageUpdateResource200Response>;
    expect(response.status).toEqual(200);
    expect(JSON.stringify(json)).toEqual(
      JSON.stringify(nodePageUpdateResource200Response),
    );
  });

  it("should update resource when passed body with type as string and rawResponse as false and return and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const json = await apiClient.updateResource(
      type,
      resourceId,
      JSON.stringify(nodePageUpdateRequest),
      { rawResponse: false },
    );
    expect(JSON.stringify(json)).toEqual(
      JSON.stringify(nodePageUpdateResource200Response),
    );
  });

  it("should update resource when passed body with type as object, rawResponse as true and return response with 200 status", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.updateResource(
      type,
      resourceId,
      nodePageUpdateRequest,
      { rawResponse: true },
    )) as RawApiResponseWithData<typeof nodePageUpdateResource200Response>;
    expect(response.status).toEqual(200);
    expect(JSON.stringify(json)).toEqual(
      JSON.stringify(nodePageUpdateResource200Response),
    );
  });
  it("should give 404 for invalid resource id, when passed with rawResponse as true and return response with 404 status and body", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const { response, json } = (await apiClient.updateResource(
      type,
      invalidResourceId,
      JSON.stringify(nodePageUpdateRequest),
      { rawResponse: true },
    )) as RawApiResponseWithData<typeof nodePageUpdateResource404Response>;
    expect(response.status).toEqual(404);
    expect(JSON.stringify(json)).toEqual(
      JSON.stringify(nodePageUpdateResource404Response),
    );
  });
  it("should throw an error if one occurs in fetch", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const logSpy = vi.spyOn(apiClient, "log");
    vi.spyOn(apiClient, "fetch").mockResolvedValueOnce({
      response: null,
      error: new Error("Something went wrong"),
    });
    try {
      await apiClient.updateResource(
        type,
        invalidResourceId,
        JSON.stringify(nodePageUpdateRequest),
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(logSpy).toHaveBeenLastCalledWith(
        "error",
        `Failed to update resource. ResourceId: ${invalidResourceId}, Error: Something went wrong`,
      );
    }
  });
});
