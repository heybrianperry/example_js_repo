import { Sha256 } from "@aws-crypto/sha256-js";
import ApiClient, { BaseUrl } from "@drupal/api-client";
import { toHex } from "@smithy/util-hex-encoding";
import type {
  EntityTypeWithBundle,
  GetOptions,
  JsonApiClientOptions,
} from "./types";

/**
 * JSON:API Client class provides functionality specific to JSON:API server.
 * @see {@link JsonApiClientOptions}
 * @see {@link BaseUrl}
 */
export default class JsonApiClient extends ApiClient {
  debug: JsonApiClientOptions["debug"];

  /**
   * Creates a new instance of the JsonApiClient.
   * @param baseUrl - The base URL of the API. {@link BaseUrl}
   * @param options - (Optional) Additional options for configuring the API client. {@link JsonApiClientOptions}
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
   * @param options - (Optional) Additional options for customizing the request. {@link GetOptions}
   * @returns A Promise that resolves to the JSON data of the requested resource.
   *
   * @example
   * Using JSONAPI.CollectionResourceDoc type from the jsonapi-typescript package
   * ```ts
   * const collection = await jsonApiClient.get<JSONAPI.CollectionResourceDoc<string, Recipe>>("node--recipe");
   * ```
   */
  async get<T>(type: EntityTypeWithBundle, options?: GetOptions) {
    const [entityTypeId, bundleId] = type.split("--");
    if (!entityTypeId || !bundleId) {
      throw new TypeError(`type must be in the format "entityType--bundle"`);
    }
    const localeSegment = options?.locale || this.defaultLocale;
    const queryString = options?.queryString ? `?${options?.queryString}` : "";

    const cacheKey = await JsonApiClient.getCacheKey(
      entityTypeId,
      bundleId,
      localeSegment,
      queryString,
    );

    if (this.cache) {
      const cachedResponse = await this.cache.get<T>(cacheKey);
      if (cachedResponse) {
        if (this.debug) {
          this.log("verbose", `Fetching from cache for key ${cacheKey}`);
        }
        return cachedResponse;
      }
    }

    const apiUrlObject = new URL(
      `${localeSegment ?? ""}/${
        this.apiPrefix
      }/${entityTypeId}/${bundleId}${queryString}`,
      this.baseUrl,
    );
    const apiUrl = apiUrlObject.toString();
    if (this.debug) {
      this.log("verbose", `Fetching endpoint ${apiUrl}`);
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

  /**
   * Generates a cache key based on the provided parameters.
   *
   * @param entityTypeId - The entity type identifier for caching.
   * @param bundleId - The bundle identifier for caching.
   * @param localeSegment - Optional. The locale segment used for cache key. Default is an empty string.
   * @param queryString - Optional. The query string used for cache key. Default is an empty string.
   *
   * @returns A promise wrapping the generated cache key as a string.
   *
   * @example
   * // Generate a cache key with entityTypeId and bundleId only
   * const key1 = await MyClass.getCacheKey('entity1', 'bundle1');
   * // key1: 'entity1--bundle1'
   *
   * @example
   * // Generate a cache key with entityTypeId, bundleId, localeSegment, and queryString
   * const key2 = await MyClass.getCacheKey('entity2', 'bundle2', 'en-US', 'param1=value1&param2=value2');
   * // key2: 'en-US--entity2--bundle2--<sha256_hash_of_query_string>'
   */
  static async getCacheKey(
    entityTypeId: string,
    bundleId: string,
    localeSegment?: string,
    queryString?: string,
  ): Promise<string> {
    const localePart = localeSegment ? `${localeSegment}--` : "";
    let queryStringPart = "";
    if (queryString) {
      const hash = new Sha256();
      hash.update(queryString);
      const hashResult = await hash.digest();
      const hashResultHex = toHex(hashResult);
      queryStringPart = `--${hashResultHex}`;
    }

    return `${localePart}${entityTypeId}--${bundleId}${queryStringPart}`;
  }
}
