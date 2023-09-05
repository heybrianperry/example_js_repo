import type { ApiClientOptions, BaseUrl } from "./types";

/**
 * Base class providing common functionality for all API clients.
 * @see {@link ApiClientOptions} and {@link BaseUrl}
 */
export default class ApiClient {
  /**
   * {@link BaseUrl}
   */
  baseUrl: BaseUrl;

  /**
   * {@link ApiClientOptions.apiPrefix}
   */
  apiPrefix: ApiClientOptions["apiPrefix"];

  /**
   * {@link ApiClientOptions.customFetch}
   */
  customFetch: ApiClientOptions["customFetch"];

  /**
   *
   * @param baseUrl - The base URL for all API requests. {@link BaseUrl}
   * @param options - Optional configuration options. {@link ApiClientOptions}
   */
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    if (!baseUrl) {
      throw new Error("baseUrl is required");
    }
    const { apiPrefix, customFetch } = options || {};
    this.baseUrl = baseUrl;
    this.apiPrefix = apiPrefix;
    this.customFetch = customFetch;
  }

  /**
   * Uses customFetch if it is set, otherwise uses the default fetch
   * @param input - {@link RequestInfo}
   * @param init - {@link RequestInit}
   * @returns a response wrapped in a promise
   */
  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    if (this.customFetch) {
      return this.customFetch(input, init);
    }
    return fetch(input, init);
  }
}
