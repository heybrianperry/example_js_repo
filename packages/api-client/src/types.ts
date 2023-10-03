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
   * Default cache implementation
   * {@link Cache}
   */
  cache?: Cache;
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

  authentication?: Authentication;

  defaultLocale?: Locale;
};

type Authentication = {
  type: "Basic";
  username?: string;
  password?: string;
};

/**
 * The cache used by the ApiClient to store responses.
 * @method get - gets a value from the cache
 * @method set - sets a value in the cache
 */
export interface Cache {
  get<T>(key: string, ...args: unknown[]): Promise<T>;
  set<T>(key: string, value: T, ...args: unknown[]): Promise<unknown>;
}

export type Locale = string;
