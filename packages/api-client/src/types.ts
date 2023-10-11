/**
 * The base URL for all API requests.
 */
export type BaseUrl = string;

/**
 * Represents a logging method that takes a message as input.
 *
 * @param message - The message to log.
 */
export type LogMethod = (message: string) => void;

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

  /**
   * Represents an optional authentication configuration.
   * @type {Authentication}
   */
  authentication?: Authentication;

  /**
   * Represents an optional default locale setting.
   * @type {Locale}
   */
  defaultLocale?: Locale;

  /**
   * Custom serializer to use for deserializing api response.
   * @type {Serializer}
   */
  serializer?: Serializer;

  /**
   * Represents a logger object with optional logging methods for various log levels.
   */
  logger?: {
    /**
     * A mapping of log levels to their corresponding logging methods.
     * The keys are log levels, and the values are functions that take a message as input.
     */
    [key in LogLevels]?: LogMethod;
  };
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

/**
 * Represents a serializer interface that defines a method for deserializing data.
 */
export interface Serializer {
  /**
   * Deserialize the given data.
   * @param body - The data to be deserialized, represented as a record of string keys and unknown values.
   * @param options - (Optional) Additional options to be used during deserialization.
   * @returns The deserialized data, which may be of any type.
   */
  deserialize(
    body: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): unknown;
}

export type LogLevels =
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";
