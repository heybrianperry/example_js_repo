import { Sha256 } from "@aws-crypto/sha256-js";
import { ApiClient, type BaseUrl } from "@drupal-api-client/api-client";
import {
  DecoupledRouterClient,
  isRaw,
  isResolved,
  type DecoupledRouterResponse,
  type RawDecoupledRouterResponse,
} from "@drupal-api-client/decoupled-router-client";
import { toHex } from "@smithy/util-hex-encoding";
import type {
  CreateOptions,
  DeleteOptions,
  EndpointUrlSegments,
  GetOptions,
  JsonApiClientOptions,
  JsonApiIndex,
  RawApiResponseWithData,
  UpdateOptions,
} from "./types";

/**
 * JSON:API Client class provides functionality specific to JSON:API server.
 * @see {@link JsonApiClientOptions}
 * @see {@link BaseUrl}
 */
export class JsonApiClient extends ApiClient {
  /**
   * link {@link DecoupledRouterClient}
   */
  router: DecoupledRouterClient;

  /**
   * @see {@link JsonApiClientOptions.indexLookup}
   */
  indexLookup: JsonApiClientOptions["indexLookup"];

  /**
   * @see {@link JsonApiClientOptions.decoupledRouterApiPrefix}
   */
  decoupledRouterApiPrefix: JsonApiClientOptions["decoupledRouterApiPrefix"];

  /**
   * Creates a new instance of the JsonApiClient.
   * @param baseUrl - The base URL of the API. {@link BaseUrl}
   * @param options - (Optional) Additional options for configuring the API client. {@link JsonApiClientOptions}
   */
  constructor(baseUrl: BaseUrl, options?: JsonApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix, cache, debug, indexLookup, decoupledRouterApiPrefix } =
      options || {};
    this.apiPrefix = apiPrefix || "jsonapi";
    this.decoupledRouterApiPrefix = decoupledRouterApiPrefix;
    this.cache = cache;
    this.debug = debug || false;

    const routerOptions = {
      ...options,
    };
    if (this.decoupledRouterApiPrefix) {
      routerOptions.apiPrefix = this.decoupledRouterApiPrefix;
    } else {
      delete routerOptions.apiPrefix;
    }
    this.router = new DecoupledRouterClient(baseUrl, routerOptions);

    this.indexLookup = indexLookup || false;
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
  async getCollection<T>(
    type: string,
    options?: GetOptions,
  ): Promise<T | RawApiResponseWithData<T>> {
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
      cacheKey: options?.cacheKey,
    });

    if (!rawResponse && !options?.disableCache) {
      const cachedResponse = await this.getCachedResponse<T>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const apiUrl = await this.createURL({
      localeSegment,
      entityTypeId,
      bundleId,
      queryString,
    });

    if (this.debug) {
      this.log("verbose", `Fetching endpoint ${apiUrl}`);
    }

    const init: RequestInit = options?.disableAuthentication
      ? { credentials: "omit" }
      : {};
    const { response, error } = await this.fetch(apiUrl, init);
    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to get collection. Type: ${type}, Error: ${error.message}`,
        );
      }
      throw error;
    }
    const json = (await this.processApiResponseAndParseBody(
      response.clone(),
      cacheKey,
      options,
    )) as T;
    if (options?.rawResponse) {
      return { response, json } as RawApiResponseWithData<T>;
    }
    return json;
  }

  /**
   * Retrieves data for a resource by ID of a specific entity type and bundle from the JSON:API.
   * @param type - The type of resource to retrieve, often in the format "entityType--bundle", but may be rewritten as a single string.
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
    type: string,
    resourceId: string,
    options?: GetOptions,
  ): Promise<T | RawApiResponseWithData<T>> {
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

    const apiUrl = await this.createURL({
      localeSegment,
      entityTypeId,
      bundleId,
      resourceId,
      queryString,
    });

    if (this.debug) {
      this.log("verbose", `Fetching endpoint ${apiUrl}`);
    }
    const init: RequestInit = options?.disableAuthentication
      ? { credentials: "omit" }
      : {};
    const { response, error } = await this.fetch(apiUrl, init);
    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to get resource. ResourceId: ${resourceId}, Error: ${error.message}`,
        );
      }
      throw error;
    }
    const json = (await this.processApiResponseAndParseBody(
      response.clone(),
      cacheKey,
      options,
    )) as T;
    if (options?.rawResponse) {
      return { response, json } as RawApiResponseWithData<T>;
    }
    return json;
  }

  /**
   * Generates an endpoint URL based on the provided parameters.
   *
   * @params params - The parameters to use for creating the URL. {@link EndpointUrlSegments}
   * @returns The endpoint URL as a string.
   */
  async createURL({
    localeSegment,
    entityTypeId,
    bundleId,
    viewName,
    viewDisplayId,
    resourceId,
    queryString,
  }: EndpointUrlSegments) {
    // If indexLookup is enabled, fetch the index and use the links to get the resource URL
    if (this.indexLookup) {
      const apiUrlObject = new URL(
        `${localeSegment ?? ""}/${this.apiPrefix}`,
        this.baseUrl,
      );
      const apiUrl = apiUrlObject.toString();
      const cacheKey = `${localeSegment ? `${localeSegment}/` : ""}${
        this.apiPrefix
      }`;
      let index: JsonApiIndex;

      // Try getting the index from the cache first.
      const cachedIndex = (await this.getCachedResponse(
        cacheKey,
      )) as JsonApiIndex;
      if (cachedIndex) {
        index = cachedIndex;
      } else {
        // Fetch from the index if it isn't in the cache
        if (this.debug) {
          this.log("verbose", `Fetching index at ${apiUrl}`);
        }
        const { response, error } = await this.fetch(apiUrl);
        if (error) {
          if (this.debug) {
            this.log("error", `Failed to get index. Error: ${error.message}`);
          }
          throw error;
        }
        index = await response.json();
        // Cache the index if we can
        if (this.cache && response.status < 400) {
          await this.cache?.set(cacheKey, index);
        }
      }

      const resourceType = `${entityTypeId}${bundleId ? `--${bundleId}` : ""}`;
      const collectionUrl = index?.links?.[resourceType]?.href;
      // If we match a resource URL, use that. Otherwise fall back to the standard URL creation
      if (collectionUrl) {
        return `${collectionUrl}${resourceId ? `/${resourceId}` : ""}${
          queryString ? `?${queryString}` : ""
        }`;
      }
    }

    if (viewName) {
      const viewApiUrlObject = new URL(
        `${localeSegment ?? ""}/${
          this.apiPrefix
        }/views/${viewName}/${viewDisplayId}${
          queryString ? `?${queryString}` : ""
        }`,
        this.baseUrl,
      );

      return viewApiUrlObject.toString();
    }

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
   * @param options - (Optional) Additional options for customizing the request. {@link DeleteOptions}
   * @returns A Promise that resolves to a Response object or RawApiResponseWithData.
   *
   * @example
   * ```typescript
   * const responseBody = await deleteResource("node--page", "7cbb8b73-8bcb-4008-874e-2bd496bd419d", { rawResponse: false });
   * ```
   */
  async deleteResource<T>(
    type: string,
    resourceId: string,
    options?: DeleteOptions,
  ): Promise<T | RawApiResponseWithData<T>> {
    const localeSegment = options?.locale || this.defaultLocale;
    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(type);
    const apiUrl = await this.createURL({
      entityTypeId,
      bundleId,
      resourceId,
      localeSegment,
    });

    const cacheKey = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      cacheKey: options?.cacheKey,
    });

    if (this.debug) {
      this.log(
        "verbose",
        `Initiating deletion of resource. Type: ${type}, ResourceId: ${resourceId}`,
      );
    }
    const init: RequestInit = options?.disableAuthentication
      ? { credentials: "omit", method: "DELETE" }
      : { method: "DELETE" };
    const { response, error } = await this.fetch(apiUrl, init);
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
    } else {
      this.log(
        "error",
        `Failed to delete resource. ResourceId: ${resourceId}, Status: ${response?.status}`,
      );
    }

    const json = (await this.processApiResponseAndParseBody(
      response.clone(),
      cacheKey,
      options,
    )) as T;
    if (options?.rawResponse) {
      return { response, json } as RawApiResponseWithData<T>;
    }
    return json;
  }

  static getEntityTypeIdAndBundleId(type: string): {
    entityTypeId: string;
    bundleId: string;
  } {
    const [entityTypeId, bundleId] = type.split("--");
    if (!bundleId) {
      return { entityTypeId, bundleId: "" };
    }
    return { entityTypeId, bundleId };
  }

  /**
   * Generates a cache key based on the provided parameters. If the cacheKey parameter is provided, it will be used as the cache key.
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
    viewName,
    viewDisplayId,
    localeSegment,
    resourceId,
    queryString,
    cacheKey,
  }: EndpointUrlSegments): Promise<string> {
    if (cacheKey) {
      return cacheKey;
    }
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

    if (viewName) {
      // We're prefixing views with view-- here to avoid conflicts with resource collections. There is nothing preventing someone from creating a view with the same name viewName and viewDisplayId as a collection's entityTypeId and bundleId, which would cause a cache key collision.
      return `view--${localePart}${viewName}${
        viewDisplayId ? `--${viewDisplayId}` : ""
      }${id}${queryStringPart}`;
    }
    return `${localePart}${entityTypeId}${
      bundleId ? `--${bundleId}` : ""
    }${id}${queryStringPart}`;
  }

  /**
   * Retrieves a collection of data of a specific view display via JSON:API views.
   * Requires that the jsonapi_views module is enabled on your Drupal site.
   * @param type - The type of resource to retrieve, in the format "name--display_id".
   * For example, "content--page_1".
   * @param options - (Optional) Additional options for customizing the request. {@link GetOptions}
   * @returns A Promise that resolves to the JSON data of the requested collection.
   *
   * @example
   * Using JSONAPI.CollectionResourceDoc type from the jsonapi-typescript package
   * ```ts
   * const view = await jsonApiClient.getView<JSONAPI.CollectionResourceDoc<string, Recipe>>("recipes--page_1");
   * ```
   */
  async getView<T>(
    type: string,
    options?: GetOptions,
  ): Promise<T | RawApiResponseWithData<T>> {
    const [viewName, viewDisplayId] = type.split("--");
    const localeSegment = options?.locale || this.defaultLocale;
    const queryString = options?.queryString;
    const rawResponse = options?.rawResponse || false;

    const cacheKey = await JsonApiClient.createCacheKey({
      viewName,
      viewDisplayId,
      localeSegment,
      queryString,
      cacheKey: options?.cacheKey,
    });

    if (!rawResponse && !options?.disableCache) {
      const cachedResponse = await this.getCachedResponse<T>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const apiUrl = await this.createURL({
      localeSegment,
      viewName,
      viewDisplayId,
      queryString,
    });

    if (this.debug) {
      this.log("verbose", `Fetching endpoint ${apiUrl}`);
    }

    const init: RequestInit = options?.disableAuthentication
      ? { credentials: "omit" }
      : {};
    const { response, error } = await this.fetch(apiUrl, init);
    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to get view. Type: ${type}, Error: ${error.message}`,
        );
      }
      throw error;
    }
    const json = (await this.processApiResponseAndParseBody(
      response.clone(),
      cacheKey,
      options,
    )) as T;
    if (options?.rawResponse) {
      return { response, json } as RawApiResponseWithData<T>;
    }
    return json;
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
   * @param options - (Optional) Additional options for customizing the request. {@link UpdateOptions}
   * @returns A Promise that resolves to a Response object or RawApiResponseWithData.
   *
   * @remarks
   * This method initiates the update of a resource by sending a PATCH request to the API.
   *
   * @example
   * ```typescript
   * const responseBody = await updateResource("node--page", "7cbb8b73-8bcb-4008-874e-2bd496bd419d", `{
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
   * }`, { rawResponse: false });
   * ```
   */
  async updateResource<T>(
    type: string,
    resourceId: string,
    body: string | object,
    options?: UpdateOptions,
  ): Promise<T | RawApiResponseWithData<T>> {
    const localeSegment = options?.locale || this.defaultLocale;
    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(type);
    const apiUrl = await this.createURL({
      entityTypeId,
      bundleId,
      resourceId,
      localeSegment,
    });

    const cacheKey = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      cacheKey: options?.cacheKey,
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
      credentials: options?.disableAuthentication ? "omit" : "same-origin",
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
    } else {
      this.log(
        "error",
        `Failed to update resource. ResourceId: ${resourceId}, Status: ${response?.status}`,
      );
    }

    const json = (await this.processApiResponseAndParseBody(
      response.clone(),
      cacheKey,
      options,
    )) as T;
    if (options?.rawResponse) {
      return { response, json } as RawApiResponseWithData<T>;
    }
    return json;
  }

  /**
   * Create a resource of the specified type using the provided body.
   *
   * @param type - The type of the entity with bundle information.
   * @param body - The body of the request.
   * @param options - (Optional) Additional options for customizing the request. {@link CreateOptions}
   * @returns A Promise that resolves to a Response object or RawApiResponseWithData.
   *
   * @remarks
   * This method initiates the creation of a resource by sending a POST request to the API.
   *
   * @example
   * ```typescript
   * const responseBody = await createResource("node--page", `{
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
   * }, { rawResponse: false });
   * ```
   */
  async createResource<T>(
    type: string,
    body: string | object,
    options?: CreateOptions,
  ): Promise<T | RawApiResponseWithData<T>> {
    const localeSegment = options?.locale || this.defaultLocale;
    const { entityTypeId, bundleId } =
      JsonApiClient.getEntityTypeIdAndBundleId(type);
    const apiUrl = await this.createURL({
      entityTypeId,
      bundleId,
      localeSegment,
    });

    const cacheKey = await JsonApiClient.createCacheKey({
      entityTypeId,
      bundleId,
      cacheKey: options?.cacheKey,
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
      credentials: options?.disableAuthentication ? "omit" : "same-origin",
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
    } else {
      this.log(
        "error",
        `Failed to create resource. Status: ${response?.status}`,
      );
    }

    const json = (await this.processApiResponseAndParseBody(
      response.clone(),
      cacheKey,
      options,
    )) as T;
    if (options?.rawResponse) {
      return { response, json } as RawApiResponseWithData<T>;
    }
    return json;
  }

  /**
   * Processes the API response and returns the JSON data.
   * @param response - The response object from the API.
   * @param cacheKey - The cache key to use for caching the response.
   * @param options  - (Optional) Additional options for customizing the request. {@link GetOptions | UpdateOptions | CreateOptions}
   */
  async processApiResponseAndParseBody<T>(
    response: Response,
    cacheKey: string,
    options?: GetOptions | UpdateOptions | CreateOptions,
  ): Promise<T | string> {
    const statusCode = response.status;
    if (statusCode === 204) {
      return "";
    }
    let json = await response.json();
    json = this.serializer?.deserialize
      ? (this.serializer.deserialize(json) as T)
      : (json as T);
    if (this.cache && !options?.disableCache && statusCode < 400) {
      await this.cache?.set(cacheKey, json);
    }
    return json;
  }
}
