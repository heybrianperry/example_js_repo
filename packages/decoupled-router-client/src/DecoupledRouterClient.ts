import {
  ApiClient,
  type ApiClientOptions,
  type BaseUrl,
} from "@drupal-api-client/api-client";
import type {
  DecoupledRouterResponse,
  GetOptions,
  RawDecoupledRouterResponse,
} from "./types";

/**
 * Decoupled Router Client class provides functionality specific to the decoupled-router module.
 * @see {@link ApiClientOptions}
 * @see {@link BaseUrl}
 */
export class DecoupledRouterClient extends ApiClient {
  /**
   * Creates a new instance of the DecoupledRouterClient.
   * @param baseUrl - The base URL of the API. {@link BaseUrl}
   * @param options - (Optional) Additional options for configuring the API client. {@link ApiClientOptions}
   */
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    super(baseUrl, options);
    const { apiPrefix } = options || {};
    this.apiPrefix = apiPrefix || "router/translate-path";
  }

  /**
   * Translates a path in the consuming application to a Drupal entity.
   * @param path - the path to translate
   * @returns A Promise that resolves to the JSON data provided by the router.
   */
  async translatePath(
    path: string,
    options?: GetOptions,
  ): Promise<DecoupledRouterResponse | RawDecoupledRouterResponse> {
    const rawResponse = options?.rawResponse || false;
    const localeSegment = options?.locale || this.defaultLocale;
    const apiUrl = this.createURL({ localeSegment, path });
    const cacheKey = DecoupledRouterClient.createCacheKey({
      localeSegment,
      path,
    });

    if (!rawResponse && !options?.disableCache) {
      const cachedResponse =
        await this.getCachedResponse<DecoupledRouterResponse>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    if (this.debug) {
      this.log("verbose", `Fetching endpoint ${apiUrl}`);
    }
    const { response, error } = await this.fetch(apiUrl);
    if (error) {
      if (this.debug) {
        this.log(
          "error",
          `Failed to translate path. Path: ${path}, Error: ${error.message}`,
        );
      }
      throw error;
    }

    const statusCode = response.status;
    const responseClone = response.clone();
    const json = await response.json();
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
   * @params params - The parameters to use for creating the URL.
   * @returns The endpoint URL as a string.
   */
  createURL({ localeSegment, path }: { localeSegment?: string; path: string }) {
    const apiUrlObject = new URL(
      `${localeSegment ?? ""}/${this.apiPrefix}?path=${path}`,
      this.baseUrl,
    );
    const apiUrl = apiUrlObject.toString();

    return apiUrl;
  }

  /**
   * Generates a cache key based on the provided parameters.
   *
   * @params params - The parameters to use for generating the cache key.
   * @returns The generated cache key as a string.
   *
   * @example
   * const key1 = await this.createCacheKey('en', '/articles/give-your-oatmeal-the-ultimate-makeover');
   * // key1: 'en--/articles/give-your-oatmeal-the-ultimate-makeover'
   */
  static createCacheKey({
    localeSegment,
    path,
  }: {
    localeSegment?: string;
    path: string;
  }) {
    return localeSegment ? `${localeSegment}--${path}` : path;
  }
}
