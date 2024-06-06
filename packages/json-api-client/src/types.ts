import type { ApiClientOptions, Locale } from "@drupal-api-client/api-client";

/**
 * Extends ApiClientOptions to add JSON:API Specific options.
 */
export interface JsonApiClientOptions extends ApiClientOptions {
  /**
   * If true, the client will use the JSON:API index endpoint to discover the available resources.
   */
  indexLookup?: boolean;
  /**
   * The api prefix to use for decoupled router
   */
  decoupledRouterApiPrefix?: string;
}

/**
 * Base options for customizing each request.
 */
export interface RequestBaseOptions {
  /**
   * The locale to use for the request.
   * If not set, the default locale will be used.
   * If no default locale is set, no locale will be used.
   */
  locale?: Locale;
  /**
   * Indicates whether the raw HTTP response should be returned.
   * When set to true, the response will not be parsed or processed, providing the raw, unaltered response from the server.
   */
  rawResponse?: boolean;

  /**
   * Whether to disable the cache for the request.
   */
  disableCache?: boolean;

  /**
   * Whether to disable the authentication for the request.
   */
  disableAuthentication?: boolean;
  /**
   * The cache key to use for the request.
   * If not set, the default cache key of `{lang}-{locale}--{entity}--{bundle}--{sha256 hash of query string if exists}` will be used.
   */
  cacheKey?: string;
}

/**
 * Options for customizing the get request.
 */
export interface GetOptions extends RequestBaseOptions {
  /**
   * A URL encoded query string to append to the request.
   * See {@link https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/fetching-resources-get} for some examples of valid query strings.
   * @remarks To help generate a valid query string, use a library like drupal-jsonapi-params {@link https://www.npmjs.com/package/drupal-jsonapi-params} and the `toQueryString` method.
   * @example
   * ```ts
   * const options = {
   *  queryString: "filter[title][value]=My%20recipe",
   * };
   * ```
   */
  queryString?: string;
}

/**
 * A string in the format "entityType--bundle".
 */
export type EntityTypeWithBundle = `${string}--${string}`;

/**
 * Parameters comprising the segments of a JSON:API endpoint URL.
 */
export interface EndpointUrlSegments {
  /**
   * The entity type identifier.
   */
  entityTypeId?: string;
  /**
   * The bundle identifier.
   */
  bundleId?: string;
  /**
   * Optional. The locale segment. Default is an empty string.
   */
  localeSegment?: string;
  /**
   * Optional. The ID of the individual resource.
   */
  resourceId?: string;
  /**
   * Optional. The query string. Default is an empty string.
   */
  queryString?: string;
  /**
   * Optional. The custom cacheKey to use for this request.
   */
  cacheKey?: string;
}

/**
 * Options for customizing the patch request.
 */
export interface UpdateOptions extends RequestBaseOptions {}

/**
 * Options for customizing the post request.
 */
export interface CreateOptions extends RequestBaseOptions {}

/**
 * Options for customizing the delete request.
 */
export interface DeleteOptions extends RequestBaseOptions {}

/**
 * A clone of the response object with the JSON parsed.
 */
export interface RawApiResponseWithData<T> {
  response: Response;
  json: T;
}

/**
 * Shape of a JSON:API index response.
 */
export interface JsonApiIndex {
  jsonapi: {
    version: string;
    meta: {
      [metaProperty: string]: string | object;
    };
  };
  data: [];
  meta: {
    [metaProperty: string]: string | object;
  };
  links: {
    [resourceType: string]: {
      href: string;
    };
  };
}
