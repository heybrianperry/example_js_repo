import { Sha256 } from "@aws-crypto/sha256-js";
import {
  ApiClient,
  type ApiClientOptions,
  type BaseUrl,
} from "@drupal-api-client/api-client";
import {
  DecoupledRouterClient,
  isRaw,
  isResolved,
  type DecoupledRouterResponse,
  type RawDecoupledRouterResponse,
} from "@drupal-api-client/decoupled-router-client";
import { toHex } from "@smithy/util-hex-encoding";
import type {
  EndpointUrlSegments,
  EntityTypeWithBundle,
  GetOptions,
} from "./types";

/**
 * JSON:API Client class provides functionality specific to JSON:API server.
 * @see {@link ApiClientOptions}
 * @see {@link BaseUrl}
 */
export class JsonApiClient extends ApiClient {
  /**
   * link {@link DecoupledRouterClient}
   */
  router: DecoupledRouterClient;

  /**
   * Creates a new instance of the JsonApiClient.
   * @param baseUrl - The base URL of the API. {@link BaseUrl}
   * @param options - (Optional) Additional options for configuring the API client. {@link JsonApiClientOptions}
   */
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix, cache, debug } = options || {};
    this.apiPrefix = apiPrefix || "jsonapi";
    this.cache = cache;
    this.debug = debug || false;
    this.router = new DecoupledRouterClient(baseUrl, options);
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
    const { response, error } = await this.fetch(apiUrl);
    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to get collection. Type: ${type}, Error: ${error.message}`,
        );
      }
      throw error;
    }
    const statusCode = response.status;
    const responseClone = response.clone();
    let json = await response.json();
    json = this.serializer
      ? (this.serializer.deserialize(json) as T)
      : (json as T);
    if (this.cache && !options?.disableCache && statusCode < 400) {
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
    const { response, error } = await this.fetch(apiUrl);
    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to get resource. ResourceId: ${resourceId}, Error: ${error.message}`,
        );
      }
      throw error;
    }
    const statusCode = response.status;
    const responseClone = response.clone();
    let json = await response.json();
    json = this.serializer
      ? (this.serializer.deserialize(json) as T)
      : (json as T);
    if (this.cache && !options?.disableCache && statusCode < 400) {
      await this.cache?.set(cacheKey, json);
    }
    if (rawResponse) {
      return { response: responseClone, json };
    }
    return json;
  }

  /**
   * Generates an endpoint URL based on the provided parameters.
   *
   * @params params - The parameters to use for creating the URL. {@link EndpointUrlSegments}
   * @returns The endpoint URL as a string.
   */
  createURL({
    localeSegment,
    entityTypeId,
    bundleId,
    resourceId,
    queryString,
  }: EndpointUrlSegments) {
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
  async deleteResource(
    type: EntityTypeWithBundle,
    resourceId: string,
  ): Promise<boolean> {
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
    const { response, error } = await this.fetch(apiUrl, { method: "DELETE" });
    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to delete resource. ResourceId: ${resourceId}, Error: ${error.message}`,
        );
      }
      throw error;
    }
    if (response.status === 204) {
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
   * @params params - The parameters to use for generating the cache key. {@link EndpointUrlSegments}
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
  }: EndpointUrlSegments): Promise<string> {
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

  /**
   * Attempts to resolve a path to a resource and then fetches the resolved resource.
   * @param path - The path to resolve and fetch.
   * @param options - (Optional) Additional options for customizing the request. {@link GetOptions}
   * @returns - A promise that resolves to either the JSON data of the requested resource or an UnResolvedPath if the path could not be resolved.
   *
   * @example
   * const article = await jsonApiClient.getResourceByPath("/articles/give-it-a-go-and-grow-your-own-herbs");
   */
  async getResourceByPath(path: string, options?: GetOptions) {
    const routingResponse:
      | DecoupledRouterResponse
      | RawDecoupledRouterResponse = await this.router.translatePath(
      path,
      options,
    );

    // The rawResponse option will flow to translatePath, so we need to handle both cases here
    const routingData: DecoupledRouterResponse = isRaw(routingResponse)
      ? routingResponse.json
      : routingResponse;

    if (isResolved(routingData)) {
      return this.getResource(
        routingData.jsonapi.resourceName,
        routingData.entity.uuid,
        options,
      );
    }
    return routingData;
  }

  /**
   * Updates a resource of the specified type using the provided resource ID.
   *
   * @param type - The type of the entity with bundle information.
   * @param resourceId - The ID of the resource to be updated.
   * @param body - The body of the request.
   * @returns A Promise that resolves to a Response object.
   *
   * @remarks
   * This method initiates the update of a resource by sending a PATCH request to the API.
   *
   * @example
   * ```typescript
   * const response = await updateResource("node--page", "7cbb8b73-8bcb-4008-874e-2bd496bd419d", `{
   *        "data": {
   *         "type": "node--page",
   *         "id": "11fc449b-aca0-4b74-bc3b-677da021f1d7",
   *         "attributes": {
   *             "drupal_internal__nid": 2,
   *             "drupal_internal__vid": 3,
   *             "langcode": "en",
   *             "revision_log": null,
   *             "status": true,
   *             "title": "test 2"
   *         }
   *     }
   * }`);
   * ```
   */
  async updateResource(
    type: EntityTypeWithBundle,
    resourceId: string,
    body: string | object,
  ): Promise<Response> {
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
        `Initiating update of resource. Type: ${type}, ResourceId: ${resourceId}`,
      );
    }

    // Setting up the required headers for a PATCH request.
    // Reference: https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/updating-existing-resources-patch#s-headers
    const headers = new Headers();
    headers.set("Accept", "application/vnd.api+json");
    headers.set("Content-Type", "application/vnd.api+json");

    const { response, error } = await this.fetch(apiUrl, {
      method: "PATCH",
      body: typeof body === "object" ? JSON.stringify(body) : body,
      headers,
    });

    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to update resource. ResourceId: ${resourceId}, Error: ${error.message}`,
        );
      }
      throw error;
    }
    if (response?.status === 200) {
      this.log(
        "verbose",
        `Successfully updated resource. ResourceId: ${resourceId}`,
      );
      return response;
    }
    this.log(
      "error",
      `Failed to update resource. ResourceId: ${resourceId}, Status: ${response?.status}`,
    );
    return response;
  }

  /**
   * Create a resource of the specified type using the provided body.
   *
   * @param type - The type of the entity with bundle information.
   * @param body - The body of the request.
   * @returns A Promise that resolves to a Response object.
   *
   * @remarks
   * This method initiates the creation of a resource by sending a POST request to the API.
   *
   * @example
   * ```typescript
   * const response = await createResource("node--page", `{
   *   "data": {
   *     "type": "node--page",
   *     "attributes": {
   *       "title": "My custom title",
   *       "body": {
   *         "value": "Custom value",
   *         "format": "plain_text"
   *       }
   *     }
   *   }
   * }`);
   * ```
   */
  async createResource(
    type: EntityTypeWithBundle,
    body: string | object,
  ): Promise<Response> {
    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(type);
    const apiUrl = this.createURL({
      entityTypeId,
      bundleId,
    });

    if (this.debug) {
      this.log("verbose", `Initiating creation of resource. Type: ${type}`);
    }

    // Setting up the required headers for a POST request.
    // Reference: https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/creating-new-resources-post#s-headers
    const headers = new Headers();
    headers.set("Accept", "application/vnd.api+json");
    headers.set("Content-Type", "application/vnd.api+json");

    const { response, error } = await this.fetch(apiUrl, {
      method: "POST",
      body: typeof body === "object" ? JSON.stringify(body) : body,
      headers,
    });

    if (error) {
      if (this.debug) {
        this.log("error", `Failed to create resource. Error: ${error.message}`);
      }
      throw error;
    }
    if (response?.status === 201) {
      this.log("verbose", `Successfully created resource of type: ${type}`);
      return response;
    }
    this.log("error", `Failed to create resource. Status: ${response?.status}`);
    return response;
  }
}
