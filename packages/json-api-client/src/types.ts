import type { Locale } from "@drupal/api-client";
import { ApiClientOptions } from "@drupal/api-client";

export type JsonApiClientOptions = ApiClientOptions & { debug?: boolean };

/**
 * Options for customizing the {@link }.
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
}

/**
 * A string in the format "entityType--bundle".
 */
export type EntityTypeWithBundle = `${string}--${string}`;
