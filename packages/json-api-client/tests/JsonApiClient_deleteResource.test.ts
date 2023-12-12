import { JsonApiClient } from "../src/JsonApiClient";

const baseUrl = "https://dev-drupal-api-client-poc.pantheonsite.io";
const resourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f6";
const invalidResourceId = "35f7cd32-2c54-49f2-8740-0b0ec2ba61f7";
const type = "node--page";

describe("JsonApiClient.getResource()", () => {
  it("should delete resource and return true", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const result = await apiClient.deleteResource(type, resourceId);
    expect(result).toEqual(true);
  });
  it("should give 404 for invalid resource id and return false", async () => {
    const apiClient = new JsonApiClient(baseUrl, { debug: true });
    const result = await apiClient.deleteResource(type, invalidResourceId);
    expect(result).toEqual(false);
  });
});
