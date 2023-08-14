export type BaseUrl = string;

export type ApiClientOptions = {
  /**
   * The base path for the JSON:API endpoint
   */
  apiPrefix?: string;
  /**
   * Custom fetch method overrides fetch in the ApiClient
   * @param input {@link RequestInfo}
   * @param init {@link RequestInit}
   * @returns a Response
   */
  customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};
