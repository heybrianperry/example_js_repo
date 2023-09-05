/**
 * The base URL for all API requests.
 */
export type BaseUrl = string;

export type ApiClientOptions = {
  /**
   * The base path for the JSON:API endpoint
   */
  apiPrefix?: string;
  /**
   * Custom fetch method overrides fetch in the ApiClient
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch}
   * @param input input to the customFetch
   * @param init additional configuration for the request like the method to use, headers, etc.
   * @returns a {@link Response} wrapped in a promise
   */
  customFetch?: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>;
};
