import { ApiClientOptions, BaseUrl } from "./types";

/**
 * Base class providing common functionality for all API clients.
 *
 * @param baseUrl - The base URL for all API requests.
 * @param options - Optional configuration options. {@link ApiClientOptions}
 */
export default class ApiClient {
  baseUrl: BaseUrl;

  apiPrefix: ApiClientOptions["apiPrefix"];

  customFetch: ApiClientOptions["customFetch"];

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
   * Wrapper for fetch that uses either default fetch or a custom fetch method if provided.
   * @param input {@link RequestInfo}
   * @param init {@link RequestInit}
   * @returns a response
   */
  async fetch(input: RequestInfo, init?: RequestInit) {
    if (this.customFetch) {
      return this.customFetch(input, init);
    }
    return fetch(input, init);
  }
}
