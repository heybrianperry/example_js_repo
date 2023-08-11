import { ApiClientOptions, BaseUrl } from "./types";

/**
 * Base class providing common functionality for all API clients.
 *
 * @param baseUrl - The base URL for all API requests.
 * @param options - Optional configuration options.
 */
export default class ApiClient {
  baseUrl: BaseUrl;

  apiPrefix: ApiClientOptions["apiPrefix"];

  customFetch: ApiClientOptions["customFetch"];

  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    const { apiPrefix, customFetch } = options || {};
    this.baseUrl = baseUrl;
    this.apiPrefix = apiPrefix;
    this.customFetch = customFetch;
  }

  async fetch(input: RequestInfo, init?: RequestInit) {
    if (this.customFetch) {
      return this.customFetch(input, init);
    }
    return fetch(input, init);
  }
}
