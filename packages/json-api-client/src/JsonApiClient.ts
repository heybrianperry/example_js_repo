import { Sha256 } from "@aws-crypto/sha256-js";
import { ApiClient, BaseUrl } from "@drupal-api-client/api-client";
import { toHex } from "@smithy/util-hex-encoding";
import type {
  CreateCacheKeyParams,
  EntityTypeWithBundle,
  GetOptions,
  JsonApiClientOptions,
} from "./types";

/**
 * JSON:API Client class provides functionality specific to JSON:API server.
 * @see {@link JsonApiClientOptions}
 * @see {@link BaseUrl}
 */
export class JsonApiClient extends ApiClient {
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
   * Retrieves a collection of data of a specific entity type and bundle from the JSON:API.
   * @param type - The type of resource to retrieve, in the format "entityType--bundle".
   * For example, "node--page". {@link EntityTypeWithBundle}
   * @param options - (Optional) Additional options for customizing the request. {@link GetOptions}
   * @returns A Promise that resolves to the JSON data of the requested resource.
   *
   * @example
   * Using JSONAPI.CollectionResourceDoc type from the jsonapi-typescript package
   * ```ts
   * const collection = await jsonApiClient.get<JSONAPI.CollectionResourceDoc<string, Recipe>>("node--recipe");
   * ```
   */
  async getCollection<T>(type: EntityTypeWithBundle, options?: GetOptions) {
    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(type);
    const localeSegment = options?.locale || this.defaultLocale;
    const queryString = options?.queryString;
    const rawResponse = options?.rawResponse || false;

    const cacheKey = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      localeSegment,
      queryString,
    });

    if (!rawResponse && !options?.disableCache) {
      const cachedResponse = await this.getCachedResponse<T>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const apiUrl = this.createURL({
      localeSegment,
      entityTypeId,
      bundleId,
      queryString,
    });

    if (this.debug) {
      this.log("verbose", `Fetching endpoint ${apiUrl}`);
    }
    const response = await this.fetch(apiUrl);
    const responseClone = response.clone();

    let json = await response.json();
    json = this.serializer
      ? (this.serializer.deserialize(json) as T)
      : (json as T);
    if (this.cache && !options?.disableCache) {
      await this.cache?.set(cacheKey, json);
    }
    if (rawResponse) {
      return { response: responseClone, json };
    }
    return json;
  }

  /**
   * Retrieves data for a resource by ID of a specific entity type and bundle from the JSON:API.
   * @param type - The type of resource to retrieve, in the format "entityType--bundle".
   * For example, "node--page". {@link EntityTypeWithBundle}
   * @param resourceId - The ID of the individual resource to retrieve.
   * @param options - (Optional) Additional options for customizing the request. {@link GetOptions}
   * @returns A Promise that resolves to the JSON data of the requested resource.
   *
   * @example
   * Using JSONAPI.CollectionResourceDoc type from the jsonapi-typescript package
   * ```ts
   * const collection = await jsonApiClient.get<JSONAPI.CollectionResourceDoc<string, Recipe>>("node--recipe");
   * ```
   */
  async getResource<T>(
    type: EntityTypeWithBundle,
    resourceId: string,
    options?: GetOptions,
  ) {
    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(type);
    const localeSegment = options?.locale || this.defaultLocale;
    const queryString = options?.queryString;
    const rawResponse = options?.rawResponse || false;

    const cacheKey = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      resourceId,
      localeSegment,
      queryString,
    });

    if (!rawResponse && !options?.disableCache) {
      const cachedResponse = await this.getCachedResponse<T>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const apiUrl = this.createURL({
      localeSegment,
      entityTypeId,
      bundleId,
      resourceId,
      queryString,
    });

    if (this.debug) {
      this.log("verbose", `Fetching endpoint ${apiUrl}`);
    }
    const response = await this.fetch(apiUrl);
    const responseClone = response.clone();

    let json = await response.json();
    json = this.serializer
      ? (this.serializer.deserialize(json) as T)
      : (json as T);
    if (this.cache && !options?.disableCache) {
      await this.cache?.set(cacheKey, json);
    }
    if (rawResponse) {
      return { response: responseClone, json };
    }
    return json;
  }

  createURL({
    localeSegment,
    entityTypeId,
    bundleId,
    resourceId,
    queryString,
  }: {
    [key: string]: string | undefined;
  }) {
    const apiUrlObject = new URL(
      `${localeSegment ?? ""}/${this.apiPrefix}/${entityTypeId}/${bundleId}${
        resourceId ? `/${resourceId}` : ""
      }${queryString ? `?${queryString}` : ""}`,
      this.baseUrl,
    );
    const apiUrl = apiUrlObject.toString();

    return apiUrl;
  }

  /**
   * Deletes a resource of the specified type using the provided resource ID.
   *
   * @param type - The type of the entity with bundle information.
   * @param resourceId - The ID of the resource to be deleted.
   * @returns A boolean indicating whether the resource deletion was successful.
   *
   * @remarks
   * This method initiates the deletion of a resource by sending a DELETE request to the API.
   * If the deletion is successful (HTTP status 204), it returns true; otherwise, it returns false.
   *
   * @example
   * ```typescript
   * const success = await deleteResource("node--page", "7cbb8b73-8bcb-4008-874e-2bd496bd419d");
   * if (success) {
   *   console.log("Resource deleted successfully.");
   * } else {
   *   console.error("Failed to delete resource.");
   * }
   * ```
   */
  async deleteResource(type: EntityTypeWithBundle, resourceId: string) {
    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(type);
    const apiUrl = this.createURL({
      entityTypeId,
      bundleId,
      resourceId,
    });

    if (this.debug) {
      this.log(
        "verbose",
        `Initiating deletion of resource. Type: ${type}, ResourceId: ${resourceId}`,
      );
    }
    const response = await this.fetch(apiUrl, { method: "DELETE" });

    if (response?.status === 204) {
      this.log(
        "verbose",
        `Successfully deleted resource. ResourceId: ${resourceId}`,
      );
      return true;
    }
    this.log(
      "error",
      `Failed to delete resource. ResourceId: ${resourceId}, Status: ${response?.status}`,
    );
    return false;
  }

  /**
   * Retrieves a cached response from the cache.
   * @param cacheKey - The cache key to use for retrieving the cached response.
   * @returns A promise wrapping the cached response as a generic type.
   */
  async getCachedResponse<T>(cacheKey: string) {
    if (!this.cache) {
      return null;
    }
    if (this.debug) {
      this.log("verbose", `Checking cache for key ${cacheKey}...`);
    }
    const cachedResponse = await this.cache.get<T>(cacheKey);
    if (!cachedResponse) {
      if (this.debug) {
        this.log("verbose", `No cached response found for key ${cacheKey}...`);
      }
      return null;
    }
    if (this.debug) {
      this.log("verbose", `Found cached response for key ${cacheKey}...`);
    }
    return cachedResponse;
  }

  static getEntityTypeIdAndBundleId(type: EntityTypeWithBundle): {
    entityTypeId: string;
    bundleId: string;
  } {
    const [entityTypeId, bundleId] = type.split("--");
    if (!entityTypeId || !bundleId) {
      throw new TypeError(`type must be in the format "entityType--bundle"`);
    }
    return { entityTypeId, bundleId };
  }

  /**
   * Generates a cache key based on the provided parameters.
   *
   * @params params - The parameters to use for generating the cache key. {@link createCacheKeyParams}
   * @returns A promise wrapping the generated cache key as a string.
   *
   * @example
   * // Generate a cache key with entityTypeId and bundleId only
   * const key1 = await MyClass.createCacheKey('entity1', 'bundle1');
   * // key1: 'entity1--bundle1'
   *
   * @example
   * // Generate a cache key with entityTypeId, bundleId, localeSegment, and queryString
   * const key2 = await MyClass.createCacheKey('entity2', 'bundle2', 'en-US', 'param1=value1&param2=value2');
   * // key2: 'en-US--entity2--bundle2--<sha256_hash_of_query_string>'
   */
  static async createCacheKey({
    entityTypeId,
    bundleId,
    localeSegment,
    resourceId,
    queryString,
  }: CreateCacheKeyParams): Promise<string> {
    const localePart = localeSegment ? `${localeSegment}--` : "";
    let queryStringPart = "";
    const id = resourceId ? `--${resourceId}` : "";
    if (queryString) {
      const hash = new Sha256();
      hash.update(queryString);
      const hashResult = await hash.digest();
      const hashResultHex = toHex(hashResult);
      queryStringPart = `--${hashResultHex}`;
    }

    return `${localePart}${entityTypeId}--${bundleId}${id}${queryStringPart}`;
  }
}
