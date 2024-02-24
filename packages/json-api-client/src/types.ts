import type { Locale } from "@drupal-api-client/api-client";

/**
 * Base options for customizing each request.
 */
export interface RequestBaseOptions {
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
}

/**
 * Options for customizing the get request.
 */
export interface GetOptions extends RequestBaseOptions {
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
  entityTypeId: string;
  /**
   * The bundle identifier.
   */
  bundleId: string;
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

export interface RawApiResponseWithData<T> {
  response: Response;
  json: T;
}
