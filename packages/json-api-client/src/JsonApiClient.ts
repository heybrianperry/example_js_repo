import ApiClient, { BaseUrl, Locale } from "@drupal/api-client";
import { JsonApiClientOptions } from "./types";

/**
 * JSON:API Client class provides functionality specific to JSON:API server.
 * @see {@link JsonApiClientOptions}
 * @see {@link BaseUrl}
 */
export default class JsonApiClient extends ApiClient {
  debug: JsonApiClientOptions["debug"];

  /**
   * Creates a new instance of the JsonApiClient.
   * @param baseUrl - The base URL of the API.
   * @param options - (Optional) Additional options for configuring the API client.
   */
  constructor(baseUrl: BaseUrl, options?: JsonApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix, cache, debug } = options || {};
    this.apiPrefix = apiPrefix || "jsonapi";
    this.cache = cache;
    this.debug = debug || false;
  }

  /**
   * Retrieves data of a specific entity type and bundle from the JSON:API.
   * @param type - The type of resource to retrieve, in the format "entityType--bundle".
   * For example, "node--page".
   * @param options - (Optional) Additional options for customizing the request.
   * @returns A Promise that resolves to the JSON data of the requested resource.
   *
   * @example
   * Using JSONAPI.CollectionResourceDoc type from the jsonapi-typescript package
   * ```
   * const collection = await jsonApiClient.get<JSONAPI.CollectionResourceDoc<string, Recipe>>("node--recipe");
   * ```
   */
  async get<T>(type: string, options?: { locale?: Locale }) {
    const [entityTypeId, bundleId] = type.split("--");
    const localeSegment = options?.locale || this.defaultLocale;
    const cacheKey = localeSegment
      ? `${localeSegment}--${entityTypeId}--${bundleId}`
      : `${entityTypeId}--${bundleId}`;

    if (this.cache) {
      const cachedResponse = await this.cache.get<T>(cacheKey);
      if (cachedResponse) {
        if (this.debug) {
          this.log("debug", `Fetching from cache for key ${cacheKey}`);
        }
        return cachedResponse;
      }
    }

    const apiUrl = `${this.baseUrl}${
      localeSegment ? `/${localeSegment}` : ""
    }/${this.apiPrefix}/${entityTypeId}/${bundleId}`;
    if (this.debug) {
      this.log("debug", `Fetching endpoint ${apiUrl}`);
    }
    const response = await this.fetch(apiUrl);
    let json = await response.json();
    json = this.serializer
      ? (this.serializer.deserialize(json) as T)
      : (json as T);
    if (this.cache) {
      await this.cache?.set(cacheKey, json);
    }
    return json;
  }
}
