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
   * The authentication configuration to use for authenticated API requests.
   */
  authentication?: Authentication;

  /**
   * The default locale to use for all API requests.
   * @see {@link Locale}
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
  /**
   * If true, logs debug messages to the console.
   */
  debug?: boolean;
};

/**
 * The response from the OAuth token endpoint
 */
export type OAuthTokenResponse = {
  /**
   * access_token
   */
  accessToken: string;
  /**
   * Uses the expires_in value from the /oauth/token endpoint to calculate the validUntil value:
   * ```ts
   * Date.now() + expires_in * 1000
   * ```
   */
  validUntil: number;
  /**
   * token_type
   * usually "Bearer"
   */
  tokenType: string;
};

/**
 * Valid auth types
 */
type AuthType = "Basic" | "OAuth" | "Custom";

/**
 * Internal type for composing Credentials types
 */
type Credentials<AT extends AuthType> = AT extends "Basic"
  ? {
      /**
       * The username to use for Basic authentication
       */
      username: string;
      /**
       * The password to use for Basic authentication
       */
      password: string;
    }
  : AT extends "OAuth"
  ? {
      /**
       * The OAuth Client ID
       */
      clientId: string;
      /**
       * The OAuth Client secret
       */
      clientSecret: string;
    }
  : AT extends "Custom"
  ? {
      /**
       * The Custom auth value
       */
      value: string;
    }
  : never;

/**
 * Internal type for composing Authentication types
 */
type Auth<AT extends AuthType> = {
  /**
   * The type of authentication to use
   * @see {@link AuthType}
   */
  type: AT;
  /**
   * The credentials to use based on the authenticate type
   * @see {@link Credentials}
   */
  credentials: Credentials<AT>;
};

/**
 * Basic Authentication uses a base64 encoded username and password
 * and the Authorization header labeled "Basic"
 */
type BasicAuth = Auth<"Basic">;

/**
 * OAuth uses OAuth2. It requests an access token from Drupal
 * using a clientId and clientSecret. If they are valid, the token
 * is returned and used for subsequent responses to Drupal.
 */
type OAuth = Auth<"OAuth">;

/**
 * Custom authentication uses a token that is passed in the Authorization header
 */
type CustomAuth = Auth<"Custom">;

/**
 * Represents the authentication configuration to use for authenticated API requests.
 */

type Authentication = BasicAuth | OAuth | CustomAuth;

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
 * Represents a serializer interface that defines methods for serializing and deserializing data.
 */
export interface Serializer {
  /**
   * Deserialize the given data.
   * @param body - The data to be deserialized, represented as a record of string keys and unknown values.
   * @param options - (Optional) Additional options to be used during deserialization.
   * @returns The deserialized data, which may be of any type.
   */
  deserialize?(
    body: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): unknown;

  /**
   * Serialize the given data.
   * @param args - The data to be serialized, represented as a record of string keys and unknown values.
   * @returns The serialized data, which may be of any type.
   */
  serialize?(...args: unknown[]): unknown;
}

export type LogLevels =
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

/**
 * Represents the return value of the fetch method.
 * Only one property will be set at a time.
 */
export type FetchReturn = Promise<
  | {
      response: Response;
      error: null;
    }
  | {
      response: null;
      error: Error;
    }
>;

/**
 * Type predicate for
 * @param arg
 * @returns true if the auth type is OAuth
 */
export const isOAuth = (arg: unknown): arg is OAuth =>
  typeof arg === "object" &&
  arg !== null &&
  "type" in arg &&
  arg.type === "OAuth";
