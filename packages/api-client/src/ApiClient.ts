import { Buffer } from "buffer";
import type { ApiClientOptions, BaseUrl, LogLevels } from "./types";
import defaultLogger from "./utils/defaultLogger";

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
   * {@link ApiClientOptions.authentication}
   */
  authentication: ApiClientOptions["authentication"];

  /**
   * {@link ApiClientOptions.defaultLocale}
   */
  defaultLocale: ApiClientOptions["defaultLocale"];

  /**
   * {@link ApiClientOptions.cache}
   */
  cache: ApiClientOptions["cache"];

  /**
   * {@link ApiClientOptions.serializer}
   */
  serializer: ApiClientOptions["serializer"];

  /**
   * {@link ApiClientOptions.logger}
   */
  logger: ApiClientOptions["logger"];

  /**
   *
   * @param baseUrl - The base URL for all API requests. {@link BaseUrl}
   * @param options - Optional configuration options. {@link ApiClientOptions}
   */
  constructor(baseUrl: BaseUrl, options?: ApiClientOptions) {
    if (!baseUrl) {
      throw new Error("baseUrl is required");
    }

    const {
      apiPrefix,
      customFetch,
      authentication,
      cache,
      defaultLocale,
      serializer,
      logger = defaultLogger,
    } = options || {};
    this.baseUrl = baseUrl;
    this.apiPrefix = apiPrefix;
    this.customFetch = customFetch;
    this.authentication = authentication;
    this.cache = cache;
    this.defaultLocale = defaultLocale;
    this.serializer = serializer;
    this.logger = logger;
  }

  /**
   * Uses customFetch if it is set, otherwise uses the default fetch
   * @param input - {@link RequestInfo}
   * @param init - {@link RequestInit}
   * @returns a response wrapped in a promise
   */
  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const newInit = this.addAuthorizationHeader(init);
    if (this.customFetch) {
      return this.customFetch(input, newInit);
    }
    return fetch(input, newInit);
  }

  /**
   * Adds an authorization header to the provided RequestInit options if authentication
   * of type "Basic" is configured.
   *
   * @param options - The RequestInit options to which the authorization header should be added.
   * @returns The updated RequestInit options with the authorization header, if applicable.
   */
  addAuthorizationHeader(options: RequestInit | undefined): RequestInit {
    const headers = new Headers(options?.headers);
    if (this.authentication && this.authentication.type === "Basic") {
      const encodedCredentials = Buffer.from(
        `${this.authentication?.username}:${this.authentication?.password}`,
      ).toString("base64");
      headers.set(
        "Authorization",
        `${this.authentication.type} ${encodedCredentials}`,
      );
    }

    return {
      ...options,
      headers,
    };
  }

  /**
   * Calls the appropriate logger method based on level
   * @param level level based on npm log levels
   * @param message the message to log
   */
  // This approach allows both this.log('error', 'message') and this.logger.error('message')
  log(level: LogLevels, message: string) {
    if (
      this.logger &&
      this.logger[level] &&
      typeof this.logger[level] === "function"
    ) {
      this.logger[level]?.(message);
    }
  }
}
