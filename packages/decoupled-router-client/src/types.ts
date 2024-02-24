import type { Locale } from "@drupal-api-client/api-client";

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
   * Indicates whether the raw HTTP response should be returned.
   * When set to true, the response will not be parsed or processed, providing the raw, unaltered response from the server.
   */
  rawResponse?: boolean;

  /**
   * Whether or not to disable the cache for the request.
   */
  disableCache?: boolean;

  /**
   * Whether or not to disable the authentication for the request.
   */
  disableAuthentication?: boolean;
}

/**
 * Shape of decoupled router response for a resolved path.
 */
export interface ResolvedPath {
  resolved: string;
  isHomePath: boolean;
  entity: {
    uuid: string;
    [entityProperty: string]: string;
  };
  label: string;
  jsonapi: {
    resourceName: `${string}--${string}`;
    [jsonapiProperty: string]: string;
  };
  meta: {
    [metaProperty: string]: string | object;
  };
}

/**
 * Shape of decoupled router response for a path that could not be resolved.
 */
export interface UnResolvedPath {
  message: string;
  details: string;
}
/**
 * Union of both possible decoupled router responses.
 */
export type DecoupledRouterResponse = ResolvedPath | UnResolvedPath;

export interface RawDecoupledRouterResponse {
  response: Response;
  json: DecoupledRouterResponse;
}

/**
 * Type predicate for
 * @param response
 * @returns true if the response is a {@link RawDecoupledRouterResponse}
 */
export const isRaw = (
  response: DecoupledRouterResponse | RawDecoupledRouterResponse,
): response is RawDecoupledRouterResponse =>
  typeof response === "object" && response !== null && "json" in response;

/**
 * Type predicate for
 * @param response
 * @returns true if the response is a {@link ResolvedPath}
 */
export const isResolved = (
  response: DecoupledRouterResponse,
): response is ResolvedPath =>
  typeof response === "object" && response !== null && "entity" in response;
