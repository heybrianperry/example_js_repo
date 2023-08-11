import ApiClient, { ApiClientOptions, BaseUrl } from "@drupal/api-client";

export default class JsonApiClient extends ApiClient {
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix } = options || {};
    this.apiPrefix = apiPrefix || "jsonapi";
  }

  getCollection(type: string) {
    const [entityTypeId, bundleId] = type.split("--");
    return this.fetch(
      `${this.baseUrl}/${this.apiPrefix}/${entityTypeId}/${bundleId}`,
    ).then((response) => response.json());
  }
}
