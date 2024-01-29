import { stringToBase64 } from "uint8array-extras";
import {
  isOAuth,
  type ApiClientOptions,
  type BaseUrl,
  type FetchReturn,
  type LogLevels,
  type OAuthTokenResponse,
} from "./types";
import defaultLogger from "./utils/defaultLogger";
import { errorChecker } from "./utils/errorChecker";

/**
 * Base class providing common functionality for all API clients.
 * @see {@link ApiClientOptions} and {@link BaseUrl}
 */
export class ApiClient {
  /**
   * Stores the OAuth token response
   */
  #oauthTokenResponse: OAuthTokenResponse | null = null;

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
      const newInit = await this.addAuthorizationHeader(init);
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
   * Fetch the OAuth token from the BaseUrl
   * @param0 the Client ID
   * @param1 the Client secret
   */
  protected async getAccessToken({
    clientId,
    clientSecret,
  }: {
    [key in "clientId" | "clientSecret"]: string;
  }): Promise<OAuthTokenResponse> {
    if (!clientId || !clientSecret || !isOAuth(this.authentication)) {
      throw new Error(
        "credentials.clientId or credentials.clientSecret is missing on the authentication option.",
      );
    }

    const tokenRequestBody: Record<string, string> = {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    };

    const apiUrl = `${this.baseUrl}/oauth/token`;

    // We are not using this.fetch() here because
    // we do not want to call addAuthorizationHeader() again.
    // Errors here will bubble up to be returned by this.fetch().
    let fetchToUse;
    fetchToUse = fetch;
    if (this.customFetch) {
      fetchToUse = this.customFetch;
    }
    const response = await fetchToUse(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(tokenRequestBody).toString(),
    });

    if (response.ok) {
      const json = (await response.json()) as {
        access_token: string;
        expires_in: number;
        token_type: string;
      };
      const token = {
        accessToken: json.access_token,
        validUntil: Date.now() + json.expires_in * 1000,
        tokenType: json.token_type,
      };
      this.#oauthTokenResponse = token;
      return token;
    }

    throw new Error("Could not authenticate with the provided credentials.");
  }

  /**
   * Adds an authorization header to the provided RequestInit options if
   * authentication of type "Basic" is configured.
   * If the authentication type is "OAuth", it will fetch a new
   * access token or use the stored access token if it exists
   * and is still valid.
   *
   * @param options - The RequestInit options to which the authorization header should be added.
   * @returns The updated RequestInit options with the authorization header, if applicable.
   */
  async addAuthorizationHeader(
    options: RequestInit | undefined,
  ): Promise<RequestInit> {
    if (!this.authentication) {
      return options || {};
    }
    const headers = new Headers(options?.headers);
    switch (this.authentication.type) {
      case "Basic": {
        const encodedCredentials = stringToBase64(
          `${this.authentication?.credentials.username}:${this.authentication?.credentials.password}`,
        );

        headers.set(
          "Authorization",
          `${this.authentication.type} ${encodedCredentials}`,
        );
        break;
      }
      case "OAuth": {
        let tokenType = this.#oauthTokenResponse?.tokenType;
        let accessToken = this.#oauthTokenResponse?.accessToken;
        // true if the stored token is no longer valid
        const tokenIsExpired =
          this.#oauthTokenResponse?.validUntil &&
          this.#oauthTokenResponse.validUntil - 10 * 1000 < Date.now();

        // Return the stored token if it has not expired, otherwise fetch a new one
        if (!tokenType || !accessToken || tokenIsExpired) {
          if (this.debug) {
            this.log(
              "debug",
              "OAuth token is missing or expired. Fetching a new one.",
            );
          }
          const tokenResponse = await this.getAccessToken({
            clientId: this.authentication.credentials.clientId,
            clientSecret: this.authentication.credentials.clientSecret,
          });
          tokenType = tokenResponse.tokenType;
          accessToken = tokenResponse.accessToken;
        }

        headers.set("Authorization", `${tokenType} ${accessToken}`);
        break;
      }
      default:
        if (this.debug) {
          this.log(
            "debug",
            "No valid authentication type is configured. Skipping authorization header.",
          );
        }
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
