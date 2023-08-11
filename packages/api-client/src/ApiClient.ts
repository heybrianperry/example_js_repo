import { ApiClientOptions, BaseUrl } from "./types";

/**
 * Base class providing common functionality for all API clients.
 *
 * @param baseUrl - The base URL for all API requests.
 * @param options - Optional configuration options.
 */
export class ApiClient {
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
      return await this.customFetch(input, init);
    } else {
      return await fetch(input, init);
    }
  }
}
