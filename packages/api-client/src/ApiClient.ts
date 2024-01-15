import { stringToBase64 } from "uint8array-extras";
import {
  type ApiClientOptions,
  type BaseUrl,
  type FetchReturn,
  type LogLevels,
} from "./types";
import defaultLogger from "./utils/defaultLogger";
import { errorChecker } from "./utils/errorChecker";

/**
 * Base class providing common functionality for all API clients.
 * @see {@link ApiClientOptions} and {@link BaseUrl}
 */
export class ApiClient {
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
   * {@link ApiClientOptions.debug}
   */
  debug: ApiClientOptions["debug"];

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
      debug,
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
    this.debug = debug;
  }

  /**
   * Uses customFetch if it is set, otherwise uses the default fetch
   * @param input - {@link RequestInfo}
   * @param init - {@link RequestInit}
   * @returns a response wrapped in a promise
   */
  async fetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<FetchReturn> {
    try {
      let fetchToUse;
      const newInit = this.addAuthorizationHeader(init);
      fetchToUse = fetch;
      if (this.customFetch) {
        fetchToUse = this.customFetch;
      }
      return { response: await fetchToUse(input, newInit), error: null };
    } catch (e: unknown) {
      const error = errorChecker(e);
      if (this.debug) {
        this.log("error", error.message);
      }
      return { response: null, error };
    }
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
      const encodedCredentials = stringToBase64(
        `${this.authentication?.username}:${this.authentication?.password}`,
      );
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
