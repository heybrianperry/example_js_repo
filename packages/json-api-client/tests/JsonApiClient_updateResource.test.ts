import { JsonApiClient } from "../src/JsonApiClient";
import nodePageUpdateRequest from "./mocks/data/node-page-update-request.json";
import nodePageUpdateResource404Response from "./mocks/data/node-page-update-resource-404-response.json";
import nodePageUpdateResource200Response from "./mocks/data/node-page-update-resource-200-response.json";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const resourceId = "11fc449b-aca0-4b74-bc3b-677da021f1d7";
const invalidResourceId = "66fc449b-aca0-4b74-bc3b-677da021f1d9";
const type = "node--page";

describe("JsonApiClient.updateResource()", () => {
  it("should update resource and return true", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const result = await apiClient.updateResource(
      type,
      resourceId,
      JSON.stringify(nodePageUpdateRequest),
    );
    expect(result.status).toEqual(200);
    const resultBody = await result.json();
    expect(JSON.stringify(resultBody)).toEqual(
      JSON.stringify(nodePageUpdateResource200Response),
    );
  });
  it("should give 404 for invalid resource id and return false", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const result = await apiClient.updateResource(
      type,
      invalidResourceId,
      JSON.stringify(nodePageUpdateRequest),
    );
    expect(result.status).toEqual(404);
    const resultBody = await result.json();
    expect(JSON.stringify(resultBody)).toEqual(
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
