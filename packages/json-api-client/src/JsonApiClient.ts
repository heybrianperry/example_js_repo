import ApiClient, { ApiClientOptions, BaseUrl } from "@drupal/api-client";

/**
 * JSON:API Client class provides functionality specific to JSON:API server.
 * @see {@link ApiClientOptions}
 * @see {@link BaseUrl}
 */
export default class JsonApiClient extends ApiClient {
  /**
   * Creates a new instance of the JsonApiClient.
   * @param baseUrl - The base URL of the API.
   * @param options - (Optional) Additional options for configuring the API client.
   */
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix, cache } = options || {};
    this.apiPrefix = apiPrefix || "jsonapi";
    this.cache = cache;
  }

  /**
   * Retrieves data of a specific entity type and bundle from the JSON:API.
   * @param type - The type of resource to retrieve, in the format "entityType--bundle".
   * For example, "node--page".
   * @returns A Promise that resolves to the JSON data of the requested resource.
   * @example
   * Using JSONAPI.CollectionResourceDoc type from the jsonapi-typescript package
   * ```
   * const collection = await jsonApiClient.get<JSONAPI.CollectionResourceDoc<string, Recipe>>("node--recipe");
   * ```
   */
  async get<T>(type: string) {
    const [entityTypeId, bundleId] = type.split("--");
    if (this.cache) {
      const cacheKey = `${entityTypeId}--${bundleId}`;
      const cachedResponse = await this.cache.get<T>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
      return this.fetch(
        `${this.baseUrl}/${this.apiPrefix}/${entityTypeId}/${bundleId}`,
      ).then(async (res) => {
        const json = (await res.clone().json()) as T;
        await this.cache?.set(cacheKey, json);
        return res.json() as T;
      });
    }
    return this.fetch(
      `${this.baseUrl}/${this.apiPrefix}/${entityTypeId}/${bundleId}`,
    ).then((response) => response.json() as T);
  }
}
