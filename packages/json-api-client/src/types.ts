import type { Locale } from "@drupal-api-client/api-client";
import { ApiClientOptions } from "@drupal-api-client/api-client";

/**
 * Options for customizing the JsonApiClient.
 */
export type JsonApiClientOptions = ApiClientOptions & { debug?: boolean };

/**
 * Options for customizing the get request.
 */
export interface GetOptions {
  /**
   * The locale to use for the request.
   * If not set, the default locale will be used.
   * If no default locale is set, no locale will be used.
   */
  locale?: Locale;
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

  /**
   * Indicates whether the raw HTTP response should be returned.
   * When set to true, the response will not be parsed or processed, providing the raw, unaltered response from the server.
   */
  rawResponse?: boolean;

  /**
   * Whether or not to disable the cache for the request.
   */
  disableCache?: boolean;
}

/**
 * A string in the format "entityType--bundle".
 */
export type EntityTypeWithBundle = `${string}--${string}`;

/**
 * Parameters for the JsonApiClient.GetCacheKey method.
 */
export interface CreateCacheKeyParams {
  /**
   * The entity type identifier for caching.
   */
  entityTypeId: string;
  /**
   * The bundle identifier for caching.
   */
  bundleId: string;
  /**
   * Optional. The locale segment used for cache key. Default is an empty string.
   */
  localeSegment?: string;
  /**
   * Optional. The ID of the individual resource for caching.
   */
  resourceId?: string;
  /**
   * Optional. The query string used for cache key. Default is an empty string.
   */
  queryString?: string;
}
